#!/usr/bin/env python3
"""
Update the Instagram feed shown on the site.

Fetches the latest posts from a PUBLIC Instagram profile with instaloader,
downloads each post's thumbnail into public/images/feed/, and rewrites
content/feed/index.json in the shape Keystatic / the site expects:

    { "items": [ { "image": "/images/feed/<shortcode>.jpg",
                   "link":  "https://www.instagram.com/p/<shortcode>/",
                   "alt":   "<caption excerpt>" }, ... ] }

Design notes
------------
* Defensive by design: if Instagram blocks us or returns nothing, the script
  exits non-zero and leaves the existing feed + images untouched, so the site
  keeps showing the last good data instead of going blank.
* The write to index.json is atomic (temp file + os.replace).
* Stale images (from posts that dropped out of the latest set) are removed only
  after a successful write.

Config via environment variables (see .env.local):
    INSTAGRAM_PROFILE   required — the public handle, without the "@"
    FEED_POST_COUNT     optional — how many posts to show (default 6)
"""

from __future__ import annotations

import getpass
import json
import os
import re
import sys
import tempfile
import time
from datetime import datetime, timezone
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parent.parent
FEED_JSON = REPO_ROOT / "content" / "feed" / "index.json"
IMG_DIR = REPO_ROOT / "public" / "images" / "feed"
PUBLIC_PREFIX = "/images/feed"

PROFILE = (os.environ.get("INSTAGRAM_PROFILE") or "").strip().lstrip("@")
try:
    COUNT = max(1, int(os.environ.get("FEED_POST_COUNT", "6")))
except ValueError:
    COUNT = 6

# Be polite between requests to reduce the chance of being rate-limited.
SLEEP_BETWEEN_POSTS = 2.0


def fail(message: str) -> "None":
    """Print an error and exit non-zero WITHOUT touching existing content."""
    print(f"[update-feed] ERROR: {message}", file=sys.stderr)
    print(
        "[update-feed] Feed left unchanged — the site keeps its last good data.",
        file=sys.stderr,
    )
    sys.exit(1)


def clean_alt(caption: str | None, profile: str, when: datetime) -> str:
    """Turn a post caption into short, single-line alt text."""
    if caption:
        text = re.sub(r"#\w+", "", caption)  # drop hashtags for readability
        text = re.sub(r"\s+", " ", text).strip()  # then collapse whitespace
        if text:
            return text[:150].strip()
    return f"Publication de @{profile} du {when:%d/%m/%Y}"


def main() -> None:
    if not PROFILE:
        fail(
            "INSTAGRAM_PROFILE is not set. Add it to .env.local "
            '(e.g. INSTAGRAM_PROFILE="indy.food").'
        )

    try:
        import instaloader  # imported here so a missing dep gives a clear message
    except ImportError:
        fail(
            "instaloader is not installed. Run the wrapper "
            "(npm run update-feed) which sets up the virtualenv, "
            "or: pip install -r scripts/requirements.txt"
        )

    import requests

    print(f"[update-feed] Fetching latest {COUNT} posts from @{PROFILE} …")
    
    loader = instaloader.Instaloader(
        quiet=True,
        download_pictures=False,
        download_videos=False,
        download_video_thumbnails=False,
        download_geotags=False,
        download_comments=False,
        save_metadata=False,
        max_connection_attempts=2,
    )
    if os.environ.get("INSTAGRAM_PASSWORD") is None:
        print(
            "[update-feed] Instagram password not set in environment; "
            "prompting for it (input is hidden)."
        )
        PASSWORD = getpass.getpass("Mot de passe : ")

    loader.login(PROFILE, os.environ.get("INSTAGRAM_PASSWORD", PASSWORD))  # optional

    try:
        profile = instaloader.Profile.from_username(loader.context, PROFILE)
        posts = profile.get_posts()
    except Exception as exc:  # ProfileNotExists, LoginRequired, Connection, etc.
        fail(
            f"could not read @{PROFILE} anonymously ({type(exc).__name__}: {exc}). "
            "Instagram may be blocking anonymous access — consider the logged-in "
            "session option (see README)."
        )

    IMG_DIR.mkdir(parents=True, exist_ok=True)

    items: list[dict] = []
    kept_files: set[str] = {".gitkeep"}

    try:
        for post in posts:
            if len(items) >= COUNT:
                break

            shortcode = post.shortcode
            filename = f"{shortcode}.jpg"
            dest = IMG_DIR / filename

            # Download the display image using instaloader's session headers.
            resp = requests.get(
                post.url,
                timeout=30,
                headers={"User-Agent": loader.context.user_agent},
            )
            resp.raise_for_status()
            dest.write_bytes(resp.content)

            when = post.date_utc.replace(tzinfo=timezone.utc)
            items.append(
                {
                    "image": f"{PUBLIC_PREFIX}/{filename}",
                    "link": f"https://www.instagram.com/p/{shortcode}/",
                    "alt": clean_alt(post.caption, PROFILE, when),
                }
            )
            kept_files.add(filename)
            print(f"[update-feed]  · {shortcode} ✓")
            time.sleep(SLEEP_BETWEEN_POSTS)
    except Exception as exc:
        fail(f"failed while downloading posts ({type(exc).__name__}: {exc}).")

    if not items:
        fail("no posts were retrieved.")

    # Atomic write of the feed JSON.
    payload = json.dumps({"items": items}, ensure_ascii=False, indent=2) + "\n"
    FEED_JSON.parent.mkdir(parents=True, exist_ok=True)
    fd, tmp_path = tempfile.mkstemp(dir=str(FEED_JSON.parent), suffix=".tmp")
    try:
        with os.fdopen(fd, "w", encoding="utf-8") as fh:
            fh.write(payload)
        os.replace(tmp_path, FEED_JSON)
    except Exception as exc:
        if os.path.exists(tmp_path):
            os.unlink(tmp_path)
        fail(f"could not write {FEED_JSON} ({exc}).")

    # Remove images that are no longer referenced (only after a successful write).
    for f in IMG_DIR.glob("*.jpg"):
        if f.name not in kept_files:
            f.unlink()

    print(f"[update-feed] Done — wrote {len(items)} posts to {FEED_JSON.name}.")


if __name__ == "__main__":
    main()

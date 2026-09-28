#!/usr/bin/env python3
"""
Refresh Instagram-sourced content on the site.

Usage:
    update_feed.py [feed|collabs|all]      (default: feed)

feed     Fetches the latest posts from INSTAGRAM_PROFILE, downloads each post's
         thumbnail into public/images/feed/, and rewrites content/feed/index.json:

             { "items": [ { "image": "/images/feed/<shortcode>.jpg",
                            "link":  "https://www.instagram.com/p/<shortcode>/",
                            "alt":   "<caption excerpt>" }, ... ] }

collabs  For every item in content/collaborations/index.json with an Instagram
         `link`, downloads the reel's video thumbnail into
         public/images/collaborations/items/<index>/image.jpg (the same layout
         Keystatic uses) and sets `image`. This replaces any existing image,
         including one picked in the CMS; items without an Instagram link are
         left alone.

Design notes
------------
* Defensive by design: if Instagram blocks us or returns nothing, the feed is
  left untouched, so the site keeps showing the last good data. In collabs
  mode, items that fail are skipped and the others are still saved.
* JSON writes are atomic (temp file + os.replace).
* Login uses a saved instaloader session instead of a password on every run,
  which is far less likely to get the account flagged.

Config via environment variables (see .env.local):
    INSTAGRAM_PROFILE   required for feed — the public handle, without the "@"
    INSTAGRAM_LOGIN     optional — account used to log in (default: INSTAGRAM_PROFILE)
    INSTAGRAM_PASSWORD  optional — only used to create the session when none is
                        saved yet; interactive runs prompt instead
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
FEED_IMG_DIR = REPO_ROOT / "public" / "images" / "feed"
FEED_PREFIX = "/images/feed"

COLLABS_JSON = REPO_ROOT / "content" / "collaborations" / "index.json"
COLLABS_IMG_DIR = REPO_ROOT / "public" / "images" / "collaborations"
COLLABS_PREFIX = "/images/collaborations"

PROFILE = (os.environ.get("INSTAGRAM_PROFILE") or "").strip().lstrip("@")
LOGIN = (os.environ.get("INSTAGRAM_LOGIN") or PROFILE).strip().lstrip("@")
try:
    COUNT = max(1, int(os.environ.get("FEED_POST_COUNT", "6")))
except ValueError:
    COUNT = 6

# Be polite between requests to reduce the chance of being rate-limited.
SLEEP_BETWEEN_POSTS = 2.0

# Matches /p/, /reel/, /reels/ and /tv/ URLs, with or without a username prefix.
SHORTCODE_RE = re.compile(
    r"instagram\.com/(?:[\w.]+/)?(?:p|reels?|tv)/([A-Za-z0-9_-]+)"
)


def log(message: str) -> None:
    print(f"[update-feed] {message}")


def fail(message: str) -> "None":
    """Print an error and exit non-zero WITHOUT touching existing content."""
    print(f"[update-feed] ERROR: {message}", file=sys.stderr)
    print(
        "[update-feed] Content left unchanged — the site keeps its last good data.",
        file=sys.stderr,
    )
    sys.exit(1)


def write_json_atomic(path: Path, data: dict) -> None:
    payload = json.dumps(data, ensure_ascii=False, indent=2) + "\n"
    path.parent.mkdir(parents=True, exist_ok=True)
    fd, tmp_path = tempfile.mkstemp(dir=str(path.parent), suffix=".tmp")
    try:
        with os.fdopen(fd, "w", encoding="utf-8") as fh:
            fh.write(payload)
        os.replace(tmp_path, path)
    except Exception as exc:
        if os.path.exists(tmp_path):
            os.unlink(tmp_path)
        fail(f"could not write {path} ({exc}).")


def make_loader():
    """Create an instaloader instance logged in via a saved session."""
    try:
        import instaloader  # imported here so a missing dep gives a clear message
    except ImportError:
        fail(
            "instaloader is not installed. Run the wrapper "
            "(npm run update-feed) which sets up the virtualenv, "
            "or: pip install -r scripts/requirements.txt"
        )

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

    if not LOGIN:
        fail(
            "no Instagram account to log in with. Set INSTAGRAM_PROFILE "
            "(or INSTAGRAM_LOGIN) in .env.local."
        )

    # 1. Reuse the saved session (the normal, unattended path).
    try:
        loader.load_session_from_file(LOGIN)
        log(f"Using saved session for @{LOGIN}.")
        return instaloader, loader
    except FileNotFoundError:
        pass

    # 2. No session yet: create one, then save it for next time.
    password = os.environ.get("INSTAGRAM_PASSWORD")
    try:
        if password:
            loader.login(LOGIN, password)
        elif sys.stdin.isatty():
            log(f"No saved session for @{LOGIN} — logging in once.")
            # interactive_login handles the 2FA prompt when needed.
            loader.interactive_login(LOGIN)
        else:
            fail(
                f"no saved session for @{LOGIN}. Run `npm run update-feed` once "
                "in a terminal to log in (or set INSTAGRAM_PASSWORD)."
            )
    except Exception as exc:  # BadCredentials, TwoFactorAuthRequired, etc.
        fail(f"login to @{LOGIN} failed ({type(exc).__name__}: {exc}).")

    loader.save_session_to_file()
    log("Session saved — future runs won't need the password.")
    return instaloader, loader


def download(loader, url: str) -> bytes:
    import requests

    resp = requests.get(
        url,
        timeout=30,
        headers={"User-Agent": loader.context.user_agent},
    )
    resp.raise_for_status()
    return resp.content


def clean_alt(caption: str | None, profile: str, when: datetime) -> str:
    """Turn a post caption into short, single-line alt text."""
    if caption:
        text = re.sub(r"#\w+", "", caption)  # drop hashtags for readability
        text = re.sub(r"\s+", " ", text).strip()  # then collapse whitespace
        if text:
            return text[:150].strip()
    return f"Publication de @{profile} du {when:%d/%m/%Y}"


def update_feed(instaloader, loader) -> None:
    if not PROFILE:
        fail(
            "INSTAGRAM_PROFILE is not set. Add it to .env.local "
            '(e.g. INSTAGRAM_PROFILE="indyslife_").'
        )

    log(f"Fetching latest {COUNT} posts from @{PROFILE} …")
    try:
        profile = instaloader.Profile.from_username(loader.context, PROFILE)
        posts = profile.get_posts()
    except Exception as exc:  # ProfileNotExists, LoginRequired, Connection, etc.
        fail(f"could not read @{PROFILE} ({type(exc).__name__}: {exc}).")

    FEED_IMG_DIR.mkdir(parents=True, exist_ok=True)

    items: list[dict] = []
    kept_files: set[str] = {".gitkeep"}

    try:
        for post in posts:
            if len(items) >= COUNT:
                break

            shortcode = post.shortcode
            filename = f"{shortcode}.jpg"
            (FEED_IMG_DIR / filename).write_bytes(download(loader, post.url))

            when = post.date_utc.replace(tzinfo=timezone.utc)
            items.append(
                {
                    "image": f"{FEED_PREFIX}/{filename}",
                    "link": f"https://www.instagram.com/p/{shortcode}/",
                    "alt": clean_alt(post.caption, PROFILE, when),
                }
            )
            kept_files.add(filename)
            log(f" · {shortcode} ✓")
            time.sleep(SLEEP_BETWEEN_POSTS)
    except Exception as exc:
        fail(f"failed while downloading posts ({type(exc).__name__}: {exc}).")

    if not items:
        fail("no posts were retrieved.")

    write_json_atomic(FEED_JSON, {"items": items})

    # Remove images that are no longer referenced (only after a successful write).
    for f in FEED_IMG_DIR.glob("*.jpg"):
        if f.name not in kept_files:
            f.unlink()

    log(f"Done — wrote {len(items)} posts to {FEED_JSON.name}.")


def update_collabs(instaloader, loader) -> None:
    try:
        data = json.loads(COLLABS_JSON.read_text(encoding="utf-8"))
    except Exception as exc:
        fail(f"could not read {COLLABS_JSON} ({exc}).")

    items = data.get("items") or []
    targets = [
        (i, item, match.group(1))
        for i, item in enumerate(items)
        if (match := SHORTCODE_RE.search(item.get("link") or ""))
    ]
    if not targets:
        log("No collaboration has an Instagram link — nothing to do.")
        return

    log(f"Fetching thumbnails for {len(targets)} collaboration(s) …")

    # Several items can point at the same reel: download each one only once.
    cache: dict[str, bytes] = {}
    updated = 0
    unchanged = 0
    failed = 0

    for i, item, shortcode in targets:
        label = f"#{i} {item.get('title', '').strip()} — {item.get('meta', '')}"
        try:
            if shortcode not in cache:
                post = instaloader.Post.from_shortcode(loader.context, shortcode)
                cache[shortcode] = download(loader, post.url)
                time.sleep(SLEEP_BETWEEN_POSTS)
        except Exception as exc:
            log(f" · {label}: failed, previous image kept ({type(exc).__name__}: {exc})")
            failed += 1
            continue

        item_dir = COLLABS_IMG_DIR / "items" / str(i)
        dest = item_dir / "image.jpg"
        image_path = f"{COLLABS_PREFIX}/items/{i}/image.jpg"
        if item.get("image") == image_path and dest.exists() and dest.read_bytes() == cache[shortcode]:
            unchanged += 1
            continue

        item_dir.mkdir(parents=True, exist_ok=True)
        # Replace whatever image the item had (e.g. image.jpeg from the CMS).
        for old in item_dir.glob("image.*"):
            old.unlink()
        dest.write_bytes(cache[shortcode])
        item["image"] = image_path
        updated += 1
        log(f" · {label} ✓")

    if updated:
        write_json_atomic(COLLABS_JSON, data)

    log(f"Done — {updated} updated, {unchanged} unchanged, {failed} failed.")
    if failed:
        sys.exit(1)


def main() -> None:
    mode = sys.argv[1] if len(sys.argv) > 1 else "feed"
    if mode not in ("feed", "collabs", "all"):
        fail(f"unknown mode {mode!r} — use feed, collabs or all.")

    instaloader, loader = make_loader()

    if mode in ("feed", "all"):
        update_feed(instaloader, loader)
    if mode in ("collabs", "all"):
        update_collabs(instaloader, loader)


if __name__ == "__main__":
    main()

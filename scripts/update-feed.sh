#!/bin/bash
#
# Runs the Instagram feed updater. Safe to run by hand (npm run update-feed)
# or from launchd on a schedule.
#
# Steps:
#   1. Ensure a Python virtualenv with instaloader exists (bootstraps on first run).
#   2. Load config from .env.local.
#   3. Run scripts/update_feed.py.
#   4. If AUTO_COMMIT is on and the feed changed, commit + push so the live
#      Vercel site redeploys.
#
set -euo pipefail

# launchd runs with a minimal PATH — make common tool locations available.
export PATH="/opt/homebrew/bin:/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin:$PATH"

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$REPO_ROOT"

VENV="$REPO_ROOT/scripts/.venv"
PYTHON="$(command -v python3 || echo /usr/bin/python3)"

log() { echo "[update-feed] $*"; }

# 1. Virtualenv bootstrap ----------------------------------------------------
if [ ! -x "$VENV/bin/python" ]; then
  log "Creating virtualenv at scripts/.venv …"
  "$PYTHON" -m venv "$VENV"
  "$VENV/bin/pip" install --quiet --upgrade pip
  "$VENV/bin/pip" install --quiet -r "$REPO_ROOT/scripts/requirements.txt"
fi

# 2. Load .env.local (export the vars the Python script reads) ---------------
if [ -f "$REPO_ROOT/.env.local" ]; then
  set -a
  # shellcheck disable=SC1091
  source "$REPO_ROOT/.env.local"
  set +a
fi

# 3. Run the updater ---------------------------------------------------------
"$VENV/bin/python" "$REPO_ROOT/scripts/update_feed.py"

# 4. Publish the update --------------------------------------------------------
# Only act if the feed actually changed. We detect changes with git when the
# folder is a repo; otherwise we assume it changed and proceed.
FEED_PATHS=(content/feed public/images/feed)
CHANGED=true
if command -v git >/dev/null 2>&1 && git rev-parse --git-dir >/dev/null 2>&1; then
  if [ -z "$(git status --porcelain "${FEED_PATHS[@]}" 2>/dev/null)" ]; then
    CHANGED=false
  fi
fi

if [ "$CHANGED" != "true" ]; then
  log "No feed changes — nothing to publish."
  exit 0
fi

# 4a. Commit + push to GitHub → Vercel auto-redeploys (recommended when your
#     repo is connected to Vercel). Enable with AUTO_COMMIT=true.
if [ "${AUTO_COMMIT:-false}" = "true" ] && command -v git >/dev/null 2>&1; then
  log "Committing updated feed …"
  git add "${FEED_PATHS[@]}"
  # Commit only if the feed paths actually have staged changes.
  if git diff --cached --quiet -- "${FEED_PATHS[@]}"; then
    log "Nothing staged to commit."
  else
    git commit -m "chore: auto-update Instagram feed" >/dev/null
    if git remote get-url origin >/dev/null 2>&1; then
      BRANCH="$(git branch --show-current)"
      # Integrate any remote commits first so the push isn't rejected
      # (e.g. edits made via the CMS in GitHub mode). Stash unrelated changes.
      git pull --rebase --autostash origin "$BRANCH" \
        || { log "git pull --rebase failed (resolve conflicts, then re-run)."; exit 1; }
      if git push origin HEAD; then
        log "Pushed to origin/$BRANCH — Vercel will redeploy."
      else
        log "git push failed. If it's an SSH auth error from launchd, see README."
        exit 1
      fi
    else
      log "No git remote 'origin' — committed locally only."
    fi
  fi
fi

# 4b. Direct deploy to Vercel (no GitHub needed). Set VERCEL_DEPLOY=true and
#     provide VERCEL_TOKEN in .env.local; the project must be linked once
#     (`vercel link`) so .vercel/project.json exists. Uploads the local files —
#     including the freshly updated feed — and builds on Vercel.
if [ "${VERCEL_DEPLOY:-false}" = "true" ]; then
  if [ -z "${VERCEL_TOKEN:-}" ]; then
    log "VERCEL_DEPLOY=true but VERCEL_TOKEN is not set — skipping deploy."
    exit 1
  fi
  # Use a globally-installed vercel if present, else npx.
  if command -v vercel >/dev/null 2>&1; then
    VERCEL=(vercel)
  else
    VERCEL=(npx --yes vercel@latest)
  fi
  log "Deploying to Vercel (production) …"
  "${VERCEL[@]}" deploy --prod --yes --token "$VERCEL_TOKEN" \
    && log "Deployed — the live site is updating." \
    || { log "Vercel deploy failed."; exit 1; }
fi

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

# 4. Optional: commit + push so the deployed site updates --------------------
# Enable by setting AUTO_COMMIT=true in .env.local. Off by default so nothing
# is pushed unexpectedly.
if [ "${AUTO_COMMIT:-false}" = "true" ] && command -v git >/dev/null 2>&1; then
  if [ -n "$(git status --porcelain content/feed public/images/feed 2>/dev/null)" ]; then
    log "Committing updated feed …"
    git add content/feed public/images/feed
    git commit -m "chore: auto-update Instagram feed" >/dev/null
    if git remote get-url origin >/dev/null 2>&1; then
      git push origin HEAD && log "Pushed — Vercel will redeploy."
    else
      log "No git remote 'origin' — committed locally only."
    fi
  else
    log "No feed changes to commit."
  fi
fi

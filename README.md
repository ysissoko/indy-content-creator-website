# Indy — Site créatrice de contenu food

Landing page for **Indy**, built with Next.js. Direction **1A — Éditorial Magazine**
(warm beige palette, Cormorant Garamond serif, terracotta accents).

Features:
- **Visual CMS (Keystatic)** — edit every number, photo and text in a browser at `/keystatic`.
- **Dynamic stats** — follower counts animate (count-up) from the CMS values.
- **Instagram feed** — a responsive grid of your latest posts, each linking to IG.
- **Social redirects** — Instagram / TikTok / Snapchat buttons open in a new tab.
- **Contact form** — visitors email you directly (sent to your inbox via Resend).

---

## Run it locally

```bash
npm install
npm run dev
```

Open http://localhost:3000

To create a production build: `npm run build` then `npm start`.

---

## 📝 Editing your content (the easy way) — `/keystatic`

Run the site (`npm run dev`) and open **http://localhost:3000/keystatic**. This is
your content editor — no code needed. From the sidebar you can edit:

| Section | What you change |
|---------|-----------------|
| **Réglages généraux** | Name, tagline, SEO text, contact email, **social links**, hero/about photos, hero badge, and the **follower-count stats** |
| **Recettes** | Add / remove / reorder recipes (title, detail, photo, link) |
| **Feed Instagram** | Your latest posts (photo + link to the post) |
| **Marques partenaires** | Partner brands and logos |
| **Témoignages** | Client testimonials |

- **Numbers** are entered as plain integers (`248000`) and are formatted
  automatically on the site (`248000 → "248 K"`, `5200000 → "5,2 M"`).
- **Photos** are uploaded right in the editor (stored under `public/images/`).
  Leave a photo empty and the site shows a tasteful striped placeholder.
- When you **Save**, your changes are written to files in `content/` and the
  site updates. (Locally: instantly. Live on Vercel: see below.)

> Prefer editing text files directly? The same content lives as JSON under
> `content/` — but the `/keystatic` UI is the intended way. `src/config/site.ts`
> now only holds fallback defaults + the data types.

---

## ✉️ Connecting the contact form (5 minutes)

The form works out of the box in "not connected" mode (it tells visitors to
email you directly). To have messages land in your inbox automatically:

1. Create a free account at **https://resend.com**.
2. Go to **API Keys → Create API Key**, copy it.
3. Open `.env.local` (already created for you) and paste it:
   ```
   RESEND_API_KEY=re_your_key_here
   ```
4. Restart the dev server. Done — messages now arrive at
   `ysissoko78@gmail.com` (change this in `src/config/site.ts` → `contactEmail`).

**About the sender address:** until you verify your own domain in Resend, emails
are sent from Resend's test address (`onboarding@resend.dev`). To send from your
own domain, verify it in Resend and set `CONTACT_FROM` in `.env.local`.

> `.env.local` is git-ignored, so your key is never committed.

---

## 🚀 Deploying (free, on Vercel)

1. Push this folder to a GitHub repo.
2. Go to **https://vercel.com**, "Add New Project", import the repo.
3. Under **Environment Variables**, add `RESEND_API_KEY` (and `CONTACT_FROM`
   if you set one). Deploy.

Your site goes live on a `*.vercel.app` URL; you can add a custom domain later.

### Editing content live on the deployed site

Locally, saving in `/keystatic` writes files directly. On the live site, Keystatic
needs to commit changes to your GitHub repo (Vercel then auto-redeploys). One-time
setup:

1. Add an env var on Vercel: `NEXT_PUBLIC_KEYSTATIC_GITHUB_REPO=your-username/your-repo`.
2. Open `https://your-site.vercel.app/keystatic` and follow the guided prompt —
   it creates a GitHub App and fills in the remaining keys
   (`KEYSTATIC_GITHUB_CLIENT_ID`, `KEYSTATIC_GITHUB_CLIENT_SECRET`,
   `KEYSTATIC_SECRET`). Add those to Vercel's env vars and redeploy.

After that, editing at `/keystatic` on the live site commits to GitHub and the
site rebuilds automatically. (Full guide: https://keystatic.com/docs/github-mode)

---

## 🤖 Auto-updating the Instagram feed (optional)

A Python script (`scripts/update_feed.py`, using **instaloader**) can refresh
the feed automatically: it grabs your latest public posts, downloads their
thumbnails into `public/images/feed/`, and rewrites `content/feed/index.json` —
the same file the CMS edits. If a run fails (e.g. Instagram throttles it), it
**keeps your last good feed** rather than blanking it.

### Setup
1. In `.env.local`, set your public handle: `INSTAGRAM_PROFILE="your.handle"`
   (optionally `FEED_POST_COUNT=6`).
2. Run it once — the first run auto-creates a Python virtualenv and installs
   instaloader:
   ```bash
   npm run update-feed
   ```
   Check `content/feed/index.json` and `public/images/feed/` updated.

### Run it automatically every 6 hours (macOS launchd)
```bash
cp scripts/com.indy.update-feed.plist ~/Library/LaunchAgents/
launchctl load ~/Library/LaunchAgents/com.indy.update-feed.plist
```
Logs go to `scripts/update-feed.log`. To stop:
`launchctl unload ~/Library/LaunchAgents/com.indy.update-feed.plist`.
(If you move the project folder, update the paths inside the `.plist`.)

### Making the *live* site update
The job runs on your Mac, so set `AUTO_COMMIT=true` in `.env.local` to have it
commit + push the new feed (this needs the GitHub repo + `git push` access set
up); Vercel then redeploys. With `AUTO_COMMIT=false` it only updates local files.

> **Reality check:** Instagram actively blocks automated/anonymous access,
> especially from cloud/datacenter IPs. Running on your home Mac (residential IP)
> works best. If anonymous access gets blocked, `instaloader` supports a
> logged-in session (`instaloader --login=you`) — ask and this can be wired in.

---

## Want *real-time* Instagram numbers later?

The current setup uses CMS-managed numbers (the most reliable approach for a
portfolio). If you later want them pulled live from Instagram, that needs an
Instagram Business/Creator account, a Meta developer app and a long-lived
token — ask and it can be wired into the stats/feed without changing the design.

## Project structure

```
keystatic.config.tsx      CMS schema (what you can edit at /keystatic)
content/                  your content, saved as JSON (edited via the CMS)
src/
  app/
    layout.tsx            fonts + SEO metadata
    page.tsx              assembles the sections
    globals.css           palette + base styles
    keystatic/            the /keystatic admin UI
    api/contact/route.ts  contact form → email (Resend)
    api/keystatic/        CMS save/read handler
  components/             one file per section
  config/site.ts          content TYPES + fallback defaults
  lib/content.ts          reads the CMS content → shape the components use
  lib/format.ts           number formatting (K / M)
scripts/
  update_feed.py          Instagram → content/feed + public/images/feed
  update-feed.sh          venv bootstrap + run + optional commit/push
  com.indy.update-feed.plist  launchd schedule (every 6h)
```

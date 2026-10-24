# Scout — put it on your phone

## 1. Upload to GitHub
1. github.com → **New repository** → name it `scout` → Public → Create.
2. **Add file → Upload files**, drag in ALL files from the Scout folder:
   `index.html, scout.js, sw.js, manifest.json, icon-32.png, icon-180.png, icon-192.png, icon-512.png`
   (UPLOAD_GUIDE.md is optional.) → **Commit changes**.
3. **Settings → Pages** → Source: *Deploy from a branch* → Branch `main` / `(root)` → Save.
4. After ~1 minute open: **https://776vvfyn45-commits.github.io/scout/**
5. iPhone: Safari → Share → **Add to Home Screen**.

## 2. Get live data (free)
1. Go to finnhub.io → sign up (free) → copy your API key.
2. In Scout → **SETUP** → paste key → **Save & test**. Pill turns **LIVE**.
Without a key, Scout runs in DEMO mode with clearly labelled sample data.

## Good to know
- First live scan takes about a minute (free plan limits speed); results are then cached.
- Free data covers mainly US-listed stocks (plus big European companies listed in the US).
- Paper trading uses fake €100 with 0.5% simulated costs. Scout never places real trades.
- Scores are not predictions. Not financial advice.

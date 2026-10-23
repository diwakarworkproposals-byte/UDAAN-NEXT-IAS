# Cloudflare Deployment Guide: NEXT IAS Cricket Tournament 2026

You can host and run this platform on Cloudflare in two ways:
1. **Cloudflare Pages** (Best & easiest for hosting the website — 100% free)
2. **Cloudflare R2 Bucket** (Object storage for hosting static files or storing registration data — 100% free up to 10GB)

---

## Method 1: Cloudflare Pages (Recommended for Website Hosting)

Cloudflare Pages is built specifically for modern web apps like this one. It is 100% free, gives you unlimited traffic, free SSL, and a permanent live URL (`https://your-project.pages.dev`).

### Option A: 1-Click Drag & Drop via Dashboard (No CLI needed)
1. Go to your [Cloudflare Dashboard](https://dash.cloudflare.com/).
2. In the left sidebar, click **Workers & Pages** → **Create application** → **Pages** tab.
3. Click **Upload assets**.
4. Give your project a name: `nextias-cricket-2026`.
5. Drag and drop the **`dist`** folder from:
   ```
   C:\Users\NEXT IAS\.gemini\antigravity\scratch\next-ias-cricket-tournament\dist
   ```
6. Click **Deploy site**.
7. In under 10 seconds, your site is live at `https://nextias-cricket-2026.pages.dev`!

### Option B: Deploy via Wrangler CLI
From this project directory, run:
```bash
cmd /c npx wrangler pages deploy dist --project-name nextias-cricket-2026
```
(Wrangler will open a browser window to authenticate with your Cloudflare account and deploy automatically).

---

## Method 2: Uploading directly to Cloudflare R2 Bucket

Cloudflare R2 is S3-compatible object storage. You can upload the compiled website directly to an R2 bucket.

### Step 1: Create an R2 Bucket
1. In [Cloudflare Dashboard](https://dash.cloudflare.com/), go to **R2** in the left menu.
2. Click **Create bucket**.
3. Name your bucket: `nextias-cricket` and click **Create Bucket**.

### Step 2: Enable Public Web Access on the R2 Bucket
1. Inside your bucket settings, go to the **Settings** tab.
2. Scroll to **Public Access**:
   - **Custom Domain:** Click *Connect Domain* and attach a domain or subdomain (e.g., `cricket.nextias.com`), OR
   - **R2.dev Subdomain:** Click *Allow Access* to get an instant public URL (`https://pub-xxxx.r2.dev`).

### Step 3: Upload the Built Website Files to R2
You can upload the contents of the `dist/` folder:
- Using the Cloudflare Dashboard: Click **Upload** → **Upload folder** or files.
- OR using the Wrangler CLI:
```bash
# Upload index.html
cmd /c npx wrangler r2 object put nextias-cricket/index.html --file dist/index.html --content-type text/html

# Upload assets
cmd /c npx wrangler r2 object put nextias-cricket/assets/index.css --file dist/assets/index-CpRMG-wZ.css --content-type text/css
cmd /c npx wrangler r2 object put nextias-cricket/assets/index.js --file dist/assets/index-BENknQeY.js --content-type application/javascript
```

---

## Method 3: Using Cloudflare R2 as the Persistent Database

If you want the player registrations (`tournament_data.json`) stored permanently inside your Cloudflare R2 bucket so registrations never get lost:

A Cloudflare Worker or Pages Function can bind directly to your R2 bucket:
```javascript
// Reading data from R2
const object = await env.MY_BUCKET.get('tournament_data.json');
const data = await object.json();

// Saving new registration to R2
await env.MY_BUCKET.put('tournament_data.json', JSON.stringify(data, null, 2));
```

### Security & Privacy on Cloudflare:
- Visitors accessing your site can only view the frontend.
- Your source code and Organizer PIN (`NEXTIAS2026`) remain secure.
- Student phone numbers are never exposed in public views.

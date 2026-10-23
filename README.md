# NEXT IAS Cricket Tournament 2026 - Official Web Portal

A modern, mobile-friendly web application for managing the NEXT IAS Cricket Tournament 2026.

## 🏏 Tournament Structure & Math
- **Total Registered Potential Players:** 108 (98 Students + 10 Captains/Organizers)
- **Teams:** 8 Teams
- **Squad Size:** 13 Players per team
- **Role Slots Per Team (13 Slots):**
  - 🏏 **5 Batsmen** (40 total across tournament)
  - ⚡ **4 All-Rounders** (32 total across tournament)
  - 🎯 **4 Bowlers** (32 total across tournament)
  - 🧤 **Wicketkeepers:** Tracked as a special capability badge across batsmen/all-rounders so it doesn't break the 13-slot mathematical balance!
- **Total Fixed Slots:** 8 × 13 = 104 Slots
- **Central Reserve Pool:** 4 Standby Players (for injury coverage, no-shows, and tactical balance)
- **Captains:** 8 Volunteer/Organizer Captains lead each team on field + 2 Tournament Directors.

---

## 🔒 Student Privacy & Security
1. **Public View:**
   - Shows Team Rosters, Player Names, Roll Numbers, Roles, Batting/Bowling styles, and Wicketkeeper badges.
   - **Student Mobile Numbers & Personal Contact details are 100% redacted** and never sent or exposed in public views.
2. **Organizer Command Center:**
   - Accessible only by entering the **Organizer PIN** (Default: `NEXTIAS2026`).
   - Shows all participant mobile numbers with click-to-call and WhatsApp shortcuts.
   - Allows instant team transfers, attendance marking, and 1-click **Export to CSV / Excel**.
3. **Telegram Communication:**
   - Official Telegram Channel / Broadcast Group is linked so students receive schedules, toss updates, and match rules without leaking their phone numbers to other students.

---

## 🚀 How to Publish Live (100% FREE & Secure)

### Option 1: 60-Second Instant Live Launch via Netlify Drop (Easiest)
1. Open your browser and go to [app.netlify.com/drop](https://app.netlify.com/drop).
2. Drag and drop the `dist` folder from:
   `C:\Users\NEXT IAS\.gemini\antigravity\scratch\next-ias-cricket-tournament\dist`
3. Netlify will immediately give you a live HTTPS link (e.g., `https://next-ias-cricket-2026.netlify.app`).
4. **Security Guarantee:** Visitors with the link can ONLY view and use the website. The code is compiled and cannot be edited or modified by anyone!

### Option 2: Full-Stack Free Cloud Hosting (Render.com)
1. Create a free account at [render.com](https://render.com).
2. Create a private GitHub repository and push this folder.
3. Click **New Web Service** on Render, select your repository, and set:
   - Build Command: `npm install && npm run build`
   - Start Command: `node server.js`
4. Render hosts the live full-stack app with persistent JSON storage completely free!

---

## 💻 Running Locally

### Start Backend & Static App:
```bash
node server.js
```
Open [http://localhost:5000](http://localhost:5000)

### Run in Live Hot-Reload Development Mode:
```bash
cmd /c npm run dev
```
Open [http://localhost:5173](http://localhost:5173)

# Deployment Guide for Telecom Connect

## Option 1: Frontend Only (Easiest & Free)

Since we have built the project, you can deploy the frontend instantly.

1.  **Go to:** [https://app.netlify.com/drop](https://app.netlify.com/drop)
2.  **Locate Folder:** Open your project folder `Telecom Billing System` > `frontend`.
3.  **Drag & Drop:** Drag the **`dist`** folder (created inside frontend) directly onto the Netlify page.
4.  **Done!** Your site will be live in seconds.

## Option 2: Full Stack (Frontend + Backend)

To run the full system (Database + API), you need Cloud Hosting.

### Step 1: Database (MySQL)
1.  Create a free account on **Aiven** or **Clever Cloud**.
2.  Create a MySQL Service.
3.  Use a database tool (like DBeaver or HeidiSQL) to connect to the cloud DB.
4.  Run the script `backend/database/schema.sql` to set up tables.

### Step 2: Backend (Node.js)
1.  Create an account on **Render.com**.
2.  Select "New Web Service" -> "Build from Git".
3.  Connect this Repo: `https://github.com/HaseebAhmad24-collab/Telecom-Connect`
4.  **Settings:**
    *   **Root Directory:** `backend`
    *   **Build Command:** `npm install`
    *   **Start Command:** `node server.js`
5.  **Environment Variables:** Add `DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_NAME` from Step 1.

### Step 3: Frontend (Netlify with Git)
1.  Go to Netlify -> "New Site from Git".
2.  Connect the Repo.
3.  **Build Settings:**
    *   **Base Directory:** `frontend`
    *   **Build Command:** `npm run build`
    *   **Publish Directory:** `dist`
4.  Add Environment Variable `VITE_API_URL` pointing to your Render Backend URL.

---
**GitHub Repository:** [https://github.com/HaseebAhmad24-collab/Telecom-Connect](https://github.com/HaseebAhmad24-collab/Telecom-Connect)

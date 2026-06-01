# ☁️ Free Cloud Deployment Guide

Follow this guide to host your Telecom Billing System permanently for free.

## 📦 Prerequisites
- GitHub Account (You already have this).
- Code pushed to GitHub (I have done this).

---

## Step 1: Create a Free Cloud Database (MySQL)
We need a database that is online 24/7. **Clever Cloud** is the easiest free option.

1.  Go to [Clever Cloud](https://www.clever-cloud.com/) and Sign Up.
2.  Click **Create an addon**.
3.  Select **MySQL**.
4.  Choose the **Dev (Free)** plan.
5.  Name it `telecom-db` and select a region (e.g. Montreal).
6.  Once created, go to the **Dashboard** tab. You will see:
    -   `MYSQL_ADDON_HOST` (DB_HOST)
    -   `MYSQL_ADDON_DB` (DB_NAME)
    -   `MYSQL_ADDON_USER` (DB_USER)
    -   `MYSQL_ADDON_PASSWORD` (DB_PASSWORD)
    -   `MYSQL_ADDON_PORT` (DB_PORT - usually 3306)

**⚠️ Important:** Connect to this database using MySQL Workbench or VS Code (SQLTools) and run the `schema.sql` and `seed.sql` scripts to create tables and admin user.

---

## Step 2: Deploy Backend (Render.com)
Render will host your Node.js server.

1.  Go to [Render.com](https://render.com/) and Sign Up.
2.  Click **New +** -> **Web Service**.
3.  Select **Build and deploy from a Git repository**.
4.  Connect your GitHub account and select `Telecom-Connect`.
5.  **Configure Settings:**
    -   **Name**: `telecom-backend`
    -   **Region**: Singapore or Frankfurt (Closer is better).
    -   **Branch**: `main`
    -   **Root Directory**: `backend` (Important!)
    -   **Runtime**: `Node`
    -   **Build Command**: `npm install`
    -   **Start Command**: `node server.js`
    -   **Instance Type**: Free
6.  **Environment Variables (Advanced Button)**:
    Add the details from Step 1:
    -   `DB_HOST` = (Value from Clever Cloud)
    -   `DB_USER` = ...
    -   `DB_PASS` = ... (PASSWORD from Clever Cloud)
    -   `DB_NAME` = ...
    -   `DB_PORT` = `3306`
    -   `JWT_SECRET` = `secr3t123`
7.  Click **Create Web Service**.
8.  Wait for deployment. Once live, copy the URL (e.g., `https://telecom-backend.onrender.com`).

---

## Step 3: Connect Frontend (Netlify)
Now tell your frontend to talk to the new online backend.

1.  Go to your **Netlify Dashboard**.
2.  Select your site (`Telecom Connect`).
3.  Go to **Site configuration** -> **Environment variables**.
4.  Add Variable:
    -   **Key**: `VITE_API_URL`
    -   **Value**: (Your Render Backend URL)/api  <-- Don't forget /api at the end
    -   Example: `https://telecom-backend.onrender.com/api`
5.  Go to **Deploys** -> **Trigger deploy**.

---

## 🎉 Done!
Your website is now 100% online. You can access it from mobile, laptop, or anywhere.

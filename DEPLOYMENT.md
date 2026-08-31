# AcadIn — 100% Free Production Deployment Guide

Follow these 3 simple steps to launch your **AcadIn** platform live on the internet at **\$0 / month cost**.

---

## Step 1: Initialize Your Live Supabase Database (Takes 60 seconds)

1. Open your [Supabase Project Dashboard](https://supabase.com/dashboard/project/exobicbvvqmxoauvekpy).
2. On the left sidebar menu, click **SQL Editor** (icon looks like `>_` or a database query).
3. Click **New Query** (or the **+** button at the top).
4. Open the master schema file in your project:
   [`supabase/00_MASTER_DEPLOYMENT_SCHEMA.sql`](./supabase/00_MASTER_DEPLOYMENT_SCHEMA.sql)
5. Copy all the text inside that file, paste it into the Supabase SQL Editor box, and click the green **Run** button at the bottom right.
6. When it finishes with `"Success. No rows returned"`, all 67 tables, security rules, and user roles are live!

---

## Step 2: Deploy Free to Vercel (Takes 2 minutes)

1. Go to [vercel.com](https://vercel.com) and click **Sign Up** (Choose "Continue with GitHub").
2. Click **Add New...** → **Project**.
3. Import your GitHub repository (`acadin` or `skillbridge-connect`).
4. In the **Environment Variables** section, paste the following:

| Name | Value |
| :--- | :--- |
| `VITE_SUPABASE_URL` | `https://exobicbvvqmxoauvekpy.supabase.co` |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | `sb_publishable_7Nh68zuhr-EPkJ9URHs7mw_s2uBG8Oa` |
| `VITE_SUPABASE_ANON_KEY` | `sb_publishable_7Nh68zuhr-EPkJ9URHs7mw_s2uBG8Oa` |

5. Click **Deploy**!
6. In about 45 seconds, Vercel will give you a live link (e.g. `https://acadin.vercel.app`).

---

## Step 3: Test Your Live Website

1. Open your live Vercel URL in your browser.
2. Sign up as a **Student** or **Industry Recruiter**.
3. Your database will store all data in real time, completely free forever!


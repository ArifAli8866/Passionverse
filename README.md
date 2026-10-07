# 🌟 PassionVerse

> **Connect Through Passion** — A modern, hobby-focused social networking platform where users connect through their passions, share projects, discover like-minded people, and chat in real time.

Built with React, Vite, TypeScript, Tailwind CSS, Supabase (Auth + PostgreSQL + Storage + Realtime).

---

## ✨ Features

- 🔐 **Authentication** — Email/password sign-up, login, Google OAuth, password reset, email verification, protected routes
- 👤 **Profiles** — Avatar, cover image, bio, location, website, hobby tags, follower/following/post counts
- 🎨 **Hobbies System** — 20+ categories (Programming, AI, Photography, Music, Fitness, Art, etc.)
- 📰 **Feeds** — Global feed, Following feed, and Hobby-filtered feed
- 📝 **Posts** — Image posts, Text posts, and Project Showcase posts (with GitHub/Demo links)
- ❤️ **Interactions** — Like, comment, reply, share, save, and report posts
- 👥 **Follow System** — Follow/unfollow users, view followers & following
- 🔍 **Advanced Search** — Search by name, username, hobby, and post content
- 🧭 **Discover Page** — Suggested users, trending hobbies, popular creators
- 💬 **Real-time Chat** — Direct messaging, online status, typing indicators, read receipts
- 🔔 **Notifications** — Likes, comments, replies, follows, and messages
- 📊 **Dashboard** — Analytics cards (posts, followers, engagement rate, profile views)
- 🌗 **Dark/Light Mode** — Theme toggle with persistence
- 📱 **Responsive** — Mobile-first, tablet & desktop layouts

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | React 19 + Vite |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| UI Components | Custom Shadcn-style components |
| Backend | Supabase (PostgreSQL) |
| Auth | Supabase Auth (Email + Google OAuth) |
| Storage | Supabase Storage |
| Realtime | Supabase Realtime |
| Forms | React Hook Form + Zod |
| Icons | Lucide React |
| State | Zustand |
| Animations | Framer Motion |
| Toasts | Sonner |

---

## 📁 Folder Structure

`
passionverse/
├── database/
│   └── schema.sql            # Complete Supabase schema + RLS + triggers
├── public/
├── src/
│   ├── components/
│   │   ├── layout/           # Navbar, Sidebar, MainLayout
│   │   ├── ui/               # Button, Input, Card, Avatar, Badge
│   │   ├── PostCard.tsx
│   │   ├── EmptyState.tsx
│   │   └── ProtectedRoute.tsx
│   ├── contexts/             # AuthContext (session management)
│   ├── hooks/                # useApi (data fetching)
│   ├── lib/                  # supabase client, utils
│   ├── pages/                # All route pages
│   ├── services/             # api.ts (Supabase queries)
│   ├── store/                # Zustand global state
│   ├── types/                # TypeScript interfaces
│   ├── App.tsx               # Routing
│   └── main.tsx              # Entry point
├── .env.example
├── database/schema.sql
└── package.json
```

---

## 🚀 Getting Started (Local Development)

### 1. Prerequisites
- [Node.js](https://nodejs.org/) v18+
- A [Supabase](https://supabase.com/) account (free tier works)
- A [GitHub](https://github.com/) account
- A [Vercel](https://vercel.com/) account

### 2. Install Dependencies

```bash
npm install
```

### 3. Run the Dev Server

```bash
npm run dev
```

Open `http://localhost:5173`

---

## 🗄️ Step 1 — Set Up the Supabase Database

### 1.1 Create a Supabase Project
1. Go to [supabase.com](https://supabase.com/) and sign in.
2. Click **New Project**.
3. Fill in:
   - **Name:** `passionverse`
   - **Database Password:** (choose a strong one & save it)
   - **Region:** pick the closest to you
4. Click **Create new project** and wait ~2 minutes for provisioning.

### 1.2 Get Your API Keys
1. In your project dashboard, go to **Settings → API** (or **Project Settings → Data API**).
2. Copy these two values:
   - **Project URL** → `https://xxxxx.supabase.co`
   - **anon public key** → `eyJhbGciOi...` (a long JWT)

### 1.3 Run the Database Schema
1. In the Supabase dashboard, open the **SQL Editor** (left sidebar).
2. Click **New query**.
3. Open the file `database/schema.sql` from this repo, **copy its entire contents**, and paste it into the SQL editor.
4. Click **Run** (▶️).
   - This creates all tables: `profiles`, `hobbies`, `posts`, `comments`, `followers`, `messages`, `notifications`, etc.
   - It enables **Row Level Security (RLS)** with proper policies.
   - It creates **triggers** (auto-create profile on signup, count maintenance).
   - It **seeds** the 20 hobby categories.

### 1.4 Create Storage Buckets
1. Go to **Storage** in the left sidebar.
2. Click **New bucket** and create these **public** buckets:
   - `avatars` — for profile pictures
   - `covers` — for cover images
   - `post-images` — for post images
3. Add this storage policy (SQL Editor) so authenticated users can upload:

`` Allow authenticated users to upload to storage buckets
CREATE POLICY "Authenticated users can upload images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id IN ('avatars', 'covers', 'post-images'));

CREATE POLICY "Public can read images"
ON storage.objects FOR SELECT
TO public
USING (bucket_id IN ('avatars', 'covers', 'post-images'));

CREATE POLICY "Users can update own images"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id IN ('avatars', 'covers', 'post-images') AND auth.uid() = owner);

CREATE POLICY "Users can delete own images"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id IN ('avatars', 'covers', 'post-images') AND auth.uid() = owner);
```

### 1.5 Configure Authentication
#### Email Auth (enabled by default)
- Go to **Authentication → Providers → Email**.
- Make sure **Enable Email Signup** is ON.
- (Optional) Turn **OFF** "Confirm email" for faster local testing.

#### Google OAuth (optional)
1. Go to **Authentication → Providers → Google**.
2. You'll need a Google Cloud OAuth client:
   - Go to [Google Cloud Console](https://console.cloud.google.com/) → **APIs & Services → Credentials**.
   - Create an **OAuth 2.0 Client ID** (Web application).
   - Add the Supabase callback URL (shown on the Supabase Google provider page) to **Authorized redirect URIs**.
   - Copy the **Client ID** and **Client Secret** into Supabase.
3. Toggle **Enable** and **Save**.

### 1.6 Add Your Credentials Locally
Create a `.env` file in the project root:

```bash
cp .env.example .env
```

Then edit `.env`:

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-public-key-here
```

Restart your dev server (`npm run dev`). Your app is now connected to Supabase! 🎉

> **Note:** This app fetches **real data at runtime**. With a fresh database there's no content yet, so every page shows proper **loading skeletons** and **empty states**. Create an account → create a post → and the feed populates instantly.

---

## 🐙 Step 2 — Push the Code to GitHub

### Option A: Using the GitHub website + CLI (recommended)

1. Go to [github.com/new](https://github.com/new) and create a new repository:
   - **Name:** `passionverse`
   - **Visibility:** Public or Private
   - **Do NOT** initialize with README/license (we already have them).
2. In your terminal, from the project folder, run:

```bash
# Initialize git
git init

# Stage all files
git add .

# First commit
git commit -m "feat: initial PassionVerse social network"

# Set your default branch
git branch -M main

# Connect to your GitHub repo (replace YOUR-USERNAME)
git remote add origin https://github.com/YOUR-USERNAME/passionverse.git

# Push to GitHub
git push -u origin main
```

> If you haven't configured Git auth, GitHub now recommends using the **GitHub CLI**:
> ```bash
> gh auth login
> gh repo create passionverse --public --source=. --push
> ```

✅ Your code is now on GitHub!

---

## ▲ Step 3 — Deploy to Vercel

### 3.1 Import the Project
1. Go to [vercel.com](https://vercel.com/) and sign in with **GitHub**.
2. Click **Add New → Project**.
3. Find your `passionverse` repo and click **Import**.
   - (If you don't see it, click **Adjust GitHub App Permissions** and grant access.)

### 3.2 Configure the Build
Vercel auto-detects Vite. Verify these settings:
- **Framework Preset:** Vite
- **Build Command:** `npm run build`
- **Output Directory:** `dist`
- **Install Command:** `npm install`

### 3.3 Add Environment Variables ⚠️ (Important!)
1. Expand the **Environment Variables** section.
2. Add both variables (same values as your local `.env`):
   - `VITE_SUPABASE_URL` = `https://your-project-id.supabase.co`
   - `VITE_SUPABASE_ANON_KEY` = `your-anon-public-key-here`
3. Click **Deploy**.

### 3.4 Update Supabase with Your Vercel URL
Once deployed, you'll get a URL like `https://passionverse.vercel.app`.
1. In Supabase → **Authentication → URL Configuration**:
   - **Site URL:** `https://passionverse.vercel.app`
   - **Redirect URLs:** add both:
     - `https://passionverse.vercel.app/auth/callback`
     - `http://localhost:5173` (for local dev)

This ensures **email verification**, **password reset**, and **Google OAuth** redirect correctly.

### 3.5 That's it! 🚀
Your app is live. Every `git push` to `main` automatically redeploys.

---

## 🔄 Continuous Deployment Flow

```
Local Dev → git commit → git push origin main
                          ↓
                     GitHub repo
                          ↓
              Vercel auto-builds & deploys
                          ↓
              Live app connected to Supabase
```

---

## 🔒 Security Features

- ✅ **Row Level Security (RLS)** on every table
- ✅ Users can only edit/delete their own content
- ✅ Protected routes (redirects to login if not authenticated)
- ✅ Zod input validation on all forms
- ✅ Server-side auth via Supabase JWT
- ✅ Public read / authenticated write patterns

---

## 📜 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server (localhost:5173) |
| `npm run build` | Production build to `dist/` |
| `npm run preview` | Preview the production build locally |

---

## 📄 License

MIT — Free to use and modify.

---

<p align="center">Made with 💜 for hobbyists, by hobbyists.<br/><b>Connect Through Passion.</b></p>

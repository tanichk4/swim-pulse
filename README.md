# SwimPulse

### Track every stroke. Reach your daily goal.

[![Live Demo](https://img.shields.io/badge/demo-live-brightgreen)](https://swim-tracker-prototype.vercel.app)
[![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=next.js&logoColor=white)](https://nextjs.org)
[![Supabase](https://img.shields.io/badge/Supabase-database-3ECF8E?logo=supabase&logoColor=white)](https://supabase.com)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)](https://typescriptlang.org)
[![Vercel](https://img.shields.io/badge/deployed-Vercel-black?logo=vercel&logoColor=white)](https://vercel.com)

**SwimPulse** is a web-first swim workout tracker that lets you log sessions, calculate calories burned, and visualise daily progress — no wearable required. Open a browser, log a swim in under 30 seconds, and watch your goal ring fill up.

[**Try the live app →**](https://swim-tracker-prototype.vercel.app) &nbsp;|&nbsp; [GitHub repo](https://github.com/tanichk4/swim-tracker-prototype)

---

<!-- Add a full-width screenshot of the main tracker screen here -->
<!-- Suggested: public/screenshots/tracker.png — capture the goal ring + session list in one shot -->
![SwimPulse Tracker](public/screenshots/tracker.png)

---

## Problem & Solution

### The Problem

Recreational swimmers who train 2–4× a week have no lightweight way to understand how many calories they burn in the pool. Every mainstream option — Garmin, Apple Fitness, Strava — **requires a hardware wearable** costing $150–$500. Spreadsheet tracking is friction-heavy. Most swimmers simply guess.

### The Solution

SwimPulse is a **zero-install web app** that uses the industry-standard MET (Metabolic Equivalent of Task) formula to estimate calorie burn from stroke type, intensity, distance, and duration. Users sign in once, set up a profile, and then log any swim in a few taps. Data syncs across devices automatically via Supabase.

**Core promise:** Log a swim in under 30 seconds. See your daily goal in one glance.

---

## User Persona

| | |
|---|---|
| **Name** | Alex, 28 |
| **Occupation** | Marketing manager |
| **Activity** | Recreational swimmer, 3× per week |
| **Goal** | Track calorie burn and stay consistent without buying a smartwatch |
| **Pain point** | Existing apps require hardware or are built for competitive athletes, not casual swimmers |
| **Tech comfort** | Uses web apps and SaaS tools daily, avoids native app installs when possible |
| **Quote** | *"I just want to know if my swim was worth it today."* |

---

## User Journey

### Step 1 — Sign Up (30 seconds)

Sign in with email or Google OAuth. No credit card, no app download.

<!-- Add screenshot: auth screen with email + Google button -->
![Auth Screen](public/screenshots/auth.png)

---

### Step 2 — Onboarding (60 seconds)

Enter height, weight, age, and sex. SwimPulse calculates your BMI and stores your profile. This data powers the personalised calorie calculation — the heavier you are, the more calories a session burns.

<!-- Add screenshot: onboarding profile form -->
![Onboarding](public/screenshots/onboarding.png)

---

### Step 3 — Log a Session (15 seconds)

Pick your stroke (freestyle, breaststroke, backstroke, butterfly, or mixed), intensity (easy / moderate / hard), distance in metres, and duration in minutes. Calories are calculated instantly using the MET formula.

<!-- Add screenshot: session log form with stroke + intensity selectors -->
![Session Form](public/screenshots/session-form.png)

---

### Step 4 — Track Your Daily Progress

The goal ring animates toward your daily 500 kcal target. The stats bar shows total distance, total minutes, session count, and avg kcal/min. Sessions are listed below with individual delete support.

<!-- Add screenshot: tracker with goal ring partially or fully filled -->
![Tracker with Goal Ring](public/screenshots/tracker-goal.png)

---

## Product Decisions

Each decision made during product design, with the reasoning and trade-offs:

| Decision | Reasoning | Trade-off |
|---|---|---|
| **MET-based calorie formula** | Uses the Compendium of Physical Activities — the same reference used in academic sports science. No hardware needed. | Less precise than heart-rate-based measurement. Assumes steady-state effort per intensity level. |
| **Daily goal, resets at midnight (UTC)** | Simple mental model. Encourages a daily habit loop rather than a cumulative "total since sign-up" that becomes meaningless. | No streak tracking or multi-day goals yet. |
| **SVG progress ring instead of a number** | Glanceable and emotionally rewarding — the ring filling toward 100% is more motivating than reading "347 kcal". | Slightly less precise than a numeric display at a glance. |
| **Web app, no native install** | Zero friction for new users. Shareable by URL. Works on any device. | No push notifications, no offline mode in v2. |
| **Optimistic UI on session log** | Session appears in the list instantly before the database confirms. Feels snappy, hides network latency. | Brief inconsistency if insert fails — auto-rolled back on error. |
| **User-configurable daily goal** | Different users have different fitness levels. A 200-kcal goal for a beginner is more motivating than always targeting 500. | Requires users to know their own benchmark, which many don't. |

---

## Metrics & Success Criteria

**North Star Metric:** Sessions logged per active user per week

This measures whether users are actually building a habit — not just signing up and leaving.

| Metric | Target | Why It Matters |
|---|---|---|
| Onboarding completion rate | > 80% | Validates that the profile form isn't a drop-off point |
| Daily goal hit rate | > 40% | Validates that the 500 kcal default is appropriately calibrated |
| Session log time (p50) | < 30 sec | Core UX promise — if logging a swim takes longer, the product fails |
| 7-day return rate (D7) | > 30% | Habit formation signal — are users coming back? |

---

## Competitive Analysis

| Feature | SwimPulse | Garmin Connect | Strava | Apple Fitness |
|---|---|---|---|---|
| No hardware required | ✅ | ❌ Requires Garmin watch | ❌ Requires GPS watch | ❌ Requires Apple Watch |
| Web-first (browser, no install) | ✅ | ❌ | Partial (mobile-first) | ❌ |
| Manual session logging | ✅ | ✅ | ✅ | ❌ |
| Swim-specific stroke tracking | ✅ | ✅ | Limited | ✅ |
| Calorie calculation | ✅ (MET formula) | ✅ (HR-based) | ✅ (HR-based) | ✅ (HR-based) |
| Personalised to user weight | ✅ | ✅ | ✅ | ✅ |
| Daily goal visualisation | ✅ | ✅ | ❌ | ✅ |
| Free tier | ✅ (fully free) | ✅ | Limited | ✅ |
| Zero friction sign-up | ✅ | ❌ | ❌ | ❌ |

**SwimPulse's differentiator:** The only option that requires no hardware and works entirely in the browser, while still delivering personalised calorie tracking for swimmers.

---

## Iteration Story

### v1 — Prototype (Vanilla HTML/CSS/JS)

Built as a single-page HTML prototype to validate the core concept: *can a form-based swim logger feel fast and useful?* All state lived in memory — sessions disappeared on refresh. No auth, no persistence. Enough to test the interaction model and the calorie formula.

**What was learned:** The MET formula felt accurate enough. The goal ring created a satisfying completion moment. Users needed persistence to feel invested.

### v2 — Production App (Current)

Rebuilt on **Next.js 15 + Supabase** to solve the persistence gap:

- **Auth** — email + Google OAuth via Supabase Auth, session cookies managed by middleware
- **Persistence** — Postgres via Supabase with Row Level Security (each user sees only their own data)
- **Optimistic UI** — sessions appear instantly, synced to DB in the background
- **Multi-device** — log on mobile at the pool, review on desktop at home
- **Deployed to Vercel** — zero-config CI/CD, global CDN

---

## Features

- **Email + Google OAuth** — one-click sign-in via Supabase Auth
- **Profile setup** — height, weight, age, sex → BMI auto-calculated
- **User-defined daily goal** — default 500 kcal, customisable per user
- **Session logging** — stroke + intensity + distance + duration → instant kcal result
- **Animated SVG goal ring** — fills toward your daily calorie target
- **Stats bar** — total metres, minutes, sessions logged, avg kcal/min
- **Session history** — view and delete any session logged today
- **Optimistic UI** — sessions appear immediately, no loading spinner
- **Full validation** — inline field errors, pace sanity checks, age-based warnings

---

## Calorie Formula

```
kcal = MET × weight_kg × (duration_min / 60)
```

MET values from the [Compendium of Physical Activities](https://sites.google.com/site/compendiumofphysicalactivities/):

| Stroke | Easy | Moderate | Hard |
|---|---|---|---|
| Freestyle | 5.8 | 7.0 | 10.0 |
| Breaststroke | 5.3 | 6.5 | 10.3 |
| Backstroke | 4.8 | 6.0 | 9.5 |
| Butterfly | 8.0 | 10.0 | 13.8 |
| Mixed | 5.5 | 7.0 | 9.5 |

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | [Next.js 15](https://nextjs.org) — App Router, Server + Client Components |
| Language | TypeScript 5 — strict mode end-to-end |
| Auth + Database | [Supabase](https://supabase.com) — Postgres, RLS, Email + Google OAuth |
| Styling | Global CSS — ocean colour palette, no Tailwind or CSS Modules |
| Deployment | [Vercel](https://vercel.com) — zero-config, global CDN |

---

<details>
<summary><strong>Developer Setup</strong></summary>

### 1. Install dependencies

```bash
npm install
```

### 2. Create a Supabase project

Go to [supabase.com](https://supabase.com) and create a new project. Run this SQL in the **SQL Editor**:

```sql
create table public.profiles (
  id         uuid primary key references auth.users(id) on delete cascade,
  height     numeric(5,1) not null check (height between 50 and 250),
  weight     numeric(5,1) not null check (weight between 10 and 300),
  age        integer      not null check (age between 1 and 120),
  sex        text         not null check (sex in ('male','female')),
  bmi        numeric(5,2) not null,
  created_at timestamptz  not null default now(),
  updated_at timestamptz  not null default now()
);

create table public.sessions (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references auth.users(id) on delete cascade,
  distance   integer     not null check (distance > 0 and distance <= 20000),
  duration   integer     not null check (duration > 0 and duration <= 480),
  stroke     text        not null check (stroke in ('freestyle','breaststroke','backstroke','butterfly','mixed')),
  intensity  text        not null check (intensity in ('easy','moderate','hard')),
  kcal       integer     not null,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;
create policy "own" on public.profiles for all using (auth.uid() = id) with check (auth.uid() = id);

alter table public.sessions enable row level security;
create policy "own" on public.sessions for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
```

Enable **Email** and **Google** providers under **Authentication → Providers**.

### 3. Set environment variables

```bash
cp .env.example .env.local
```

Fill in your Supabase project values:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### 4. Run

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

### Deploying to Vercel

1. Push this repo to GitHub
2. Import at [vercel.com/new](https://vercel.com/new)
3. Add `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` in Project Settings → Environment Variables
4. Deploy
5. In Supabase → **Authentication → URL Configuration**, set:
   - Site URL: `https://your-app.vercel.app`
   - Redirect URL: `https://your-app.vercel.app/auth/callback`

---

### Project structure

```
src/
├── app/
│   ├── globals.css           # All styles — ocean palette, animations
│   ├── page.tsx              # Root redirect (no session → /auth, session → /tracker)
│   ├── auth/page.tsx         # Login / signup screen
│   ├── auth/callback/route.ts# OAuth PKCE code exchange
│   ├── onboarding/page.tsx   # Body profile form
│   └── tracker/page.tsx      # Main tracker (Server Component, fetches profile + sessions)
├── components/
│   ├── TrackerScreen.tsx     # State orchestrator — owns sessions[], handles mutations
│   ├── AuthScreen.tsx        # Email + Google OAuth login/signup
│   ├── OnboardingScreen.tsx  # Profile form with validation + BMI calculation
│   ├── ProfileStrip.tsx      # Compact profile display + Edit shortcut
│   ├── GoalRing.tsx          # SVG progress ring (driven by totalKcal prop)
│   ├── StatsGrid.tsx         # Distance / minutes / sessions / kcal/min
│   ├── SessionForm.tsx       # Workout log form with validation
│   ├── SessionList.tsx       # Session list with slide-out delete animation
│   └── SessionConfirm.tsx    # Toast notification after logging
└── lib/
    ├── supabase/server.ts    # Server Component Supabase client
    ├── supabase/client.ts    # Browser singleton Supabase client
    ├── types.ts              # Profile, Session, Stroke, Intensity
    ├── constants.ts          # MET table, DAILY_GOAL_KCAL
    └── calculations.ts       # calcCalories(), calcBMI(), bmiLabel()
```

</details>

---

## Screenshots Setup

To populate the screenshot placeholders in this README, create a `public/screenshots/` folder and add:

| Filename | What to capture |
|---|---|
| `auth.png` | The auth screen — email form + Google button |
| `onboarding.png` | The profile setup form |
| `session-form.png` | The session log form with stroke / intensity selectors |
| `tracker.png` | The main tracker — goal ring + stats bar |
| `tracker-goal.png` | The tracker with goal ring partially or fully filled |

---

*Built by [Tetiana Fedorkiv](https://github.com/tanichk4)*

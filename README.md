# SwimPulse

A swim workout tracker with calorie tracking, daily goal progress, and persistent session history — built with Next.js 15, Supabase, and TypeScript.

https://swim-tracker-prototype.vercel.app/tracker

---

## Features

- **Email + Google OAuth** — secure sign-in via Supabase Auth
- **Profile setup** — height, weight, age, sex → BMI calculated on the fly
- **Session logging** — stroke, intensity, distance, duration → kcal via MET formula
- **Animated goal ring** — SVG progress ring tracking daily 500 kcal target
- **Stats bar** — total meters, minutes, sessions, avg kcal/min
- **Persistent data** — sessions and profile stored in Supabase Postgres, synced across devices
- **Full validation** — inline warnings, error toasts, pace sanity checks

---

## Calorie formula

```
kcal = MET × weight_kg × duration_hours
```

| Stroke       | Easy | Moderate | Hard  |
|--------------|------|----------|-------|
| Freestyle    | 5.8  | 7.0      | 10.0  |
| Breaststroke | 5.3  | 6.5      | 10.3  |
| Backstroke   | 4.8  | 6.0      |  9.5  |
| Butterfly    | 8.0  | 10.0     | 13.8  |
| Mixed        | 5.5  | 7.0      |  9.5  |

MET values from the Compendium of Physical Activities.

---

## Tech stack

- **Next.js 15** — App Router, TypeScript, Server + Client Components
- **Supabase** — Postgres database, Row Level Security, Email + Google OAuth (`@supabase/ssr`)
- **Global CSS** — ocean colour palette via CSS custom properties, no Tailwind or CSS Modules
- **Vercel** — zero-config deployment

---

## Local development

### 1. Install dependencies

```bash
npm install
```

### 2. Create a Supabase project

Go to [supabase.com](https://supabase.com) and create a new project. Then run this SQL in the **SQL editor**:

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

Copy `.env.example` to `.env.local` and fill in your Supabase project values:

```bash
cp .env.example .env.local
```

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

## Deploying to Vercel

1. Push this repo to GitHub
2. Import the repo at [vercel.com/new](https://vercel.com/new)
3. Add the two environment variables (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`) in Project Settings
4. Deploy
5. Copy the deployed URL into Supabase **Authentication → URL Configuration**:
   - Site URL: `https://your-app.vercel.app`
   - Redirect URL: `https://your-app.vercel.app/auth/callback`

---

## Project structure

```
src/
├── app/
│   ├── globals.css           # All styles — ocean palette, animations
│   ├── layout.tsx            # Root layout
│   ├── page.tsx              # Root redirect (no session → /auth, session → /tracker)
│   ├── auth/
│   │   ├── page.tsx          # Login / signup screen
│   │   └── callback/route.ts # OAuth code exchange
│   ├── onboarding/
│   │   └── page.tsx          # Body profile form
│   └── tracker/
│       └── page.tsx          # Main tracker (fetches profile + today's sessions)
├── components/
│   ├── AuthScreen.tsx
│   ├── OnboardingScreen.tsx
│   ├── TrackerScreen.tsx     # State orchestrator
│   ├── ProfileStrip.tsx
│   ├── GoalRing.tsx
│   ├── StatsGrid.tsx
│   ├── SessionForm.tsx
│   ├── SessionList.tsx
│   └── SessionConfirm.tsx
└── lib/
    ├── supabase/
    │   ├── server.ts         # Server Component client
    │   └── client.ts         # Browser client singleton
    ├── types.ts
    ├── constants.ts          # MET table, DAILY_GOAL_KCAL
    └── calculations.ts       # calcCalories(), calcBMI()
```

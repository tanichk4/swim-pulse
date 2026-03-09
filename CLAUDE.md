# CLAUDE.md

This file provides guidance to Claude Code when working with this repository.

## Overview

SwimPulse is a Next.js 15 (App Router) + Supabase swim tracker. Run with `npm run dev`. No backend server to manage — data lives in Supabase Postgres.

## Stack

- **Next.js 15** App Router, TypeScript, `src/` directory
- **Supabase** (`@supabase/ssr`) — auth + Postgres
- **Global CSS** — `src/app/globals.css`, no Tailwind, no CSS Modules

## File structure

```
src/
├── app/
│   ├── globals.css           # Ocean palette CSS vars + all animations
│   ├── layout.tsx
│   ├── page.tsx              # Redirect: no session → /auth, session → /tracker
│   ├── auth/page.tsx         # Renders <AuthScreen />
│   ├── auth/callback/route.ts # OAuth PKCE code exchange
│   ├── onboarding/page.tsx   # Server: fetches existing profile, renders <OnboardingScreen />
│   └── tracker/page.tsx      # Server: fetches profile + today's sessions, renders <TrackerScreen />
├── components/
│   ├── AuthScreen.tsx        # 'use client' — email + Google OAuth login/signup
│   ├── OnboardingScreen.tsx  # 'use client' — profile form, upserts to profiles table
│   ├── TrackerScreen.tsx     # 'use client' — state orchestrator, owns sessions[] + lastLoggedAt
│   ├── ProfileStrip.tsx      # 'use client' — compact profile display, Edit → /onboarding
│   ├── GoalRing.tsx          # SVG ring, strokeDashoffset driven by totalKcal prop
│   ├── StatsGrid.tsx         # Pure display, no 'use client' needed
│   ├── SessionForm.tsx       # 'use client' — validation + onLog callback
│   ├── SessionList.tsx       # 'use client' — removingIds animation Set, confirm dialog
│   └── SessionConfirm.tsx    # 'use client' — useEffect on lastLoggedAt for auto-hide
└── lib/
    ├── supabase/server.ts    # createSupabaseServerClient() — used in Server Components
    ├── supabase/client.ts    # getSupabaseBrowserClient() singleton — used in Client Components
    ├── types.ts              # Profile, Session, Stroke, Intensity
    ├── constants.ts          # MET table, DAILY_GOAL_KCAL = 500
    └── calculations.ts       # calcCalories(), calcBMI(), bmiLabel()
src/middleware.ts             # Session cookie refresh + route protection on every request
```

## Auth flow

```
/ → redirect based on session
  No session → /auth
  Session    → /tracker

middleware.ts protects /tracker and /onboarding → redirects to /auth
/tracker (Server Component) redirects to /onboarding if no profile row exists
```

## Data flow

`tracker/page.tsx` (Server) fetches `profile` and today's sessions from Supabase, passes them as `initialProfile` and `initialSessions` props to `TrackerScreen`.

`TrackerScreen` (Client) owns `sessions` state and all mutations:
- **`handleLog`** — optimistic insert: adds temp UUID session to state immediately, then does `supabase.insert()`, replaces optimistic entry with real DB record on success, rolls back on error
- **`handleRemove`** — `SessionList` handles 350ms animation delay before calling this; removes from state + `supabase.delete()`
- **`handleClearAll`** — deletes by current session IDs (not `user_id`), clears state

## Business logic

**Calorie formula** (`src/lib/calculations.ts`):
```
kcal = MET[stroke][intensity] × weight_kg × (duration_min / 60)
```
Result rounded to integer. `calcCalories` takes explicit `weightKg` argument.

**BMI**: `weight_kg / (height_cm / 100)²`

**Validation** (ported 1:1 from original prototype):
- Profile fields: height 50–250 cm, weight 10–300 kg, age 1–120
- Session fields: distance > 0 and ≤ 20,000 m, duration > 0 and ≤ 480 min
- Pace sanity: `duration / (distance / 100) < 0.5 min/100m` → error

**Warnings** (non-blocking, shown on blur):
- Age-based height: age < 7 → max 130 cm, age < 10 → max 155 cm, age < 14 → max 180 cm
- Age-based weight: age < 7 → max 35 kg, age < 10 → max 50 kg, age < 14 → max 70 kg
- BMI < 12 or > 60 → sanity warning

## CSS

All styles are in `src/app/globals.css`. Global CSS — no scoping, no modules. Class names used directly in JSX.

Key CSS custom properties: `--deep`, `--ocean`, `--wave`, `--foam`, `--glow`, `--coral`, `--sand`, `--white`, `--warn`, `--rose`, `--sky`

Animations: `slideIn`, `screenIn`, `removeSlide`, `toastIn`, `toastOut`, `shake`

The `.screen { display: none }` + `.active` pattern from the prototype is preserved — components use `id="screenOnboarding" className="screen active"` (onboarding/auth) and `id="screenTracker" className="screen active"` (tracker).

## Database schema

```
profiles: id (FK auth.users), height, weight, age, sex, bmi, created_at, updated_at
sessions: id, user_id (FK auth.users), distance, duration, stroke, intensity, kcal, created_at
```

RLS on both tables — users only see their own rows. Sessions are loaded filtered to today (UTC midnight).

## TypeScript note

Supabase `setAll` cookie callbacks require explicit typing:
```typescript
setAll(cookiesToSet: { name: string; value: string; options?: object }[])
// Cast options as: options as Parameters<typeof cookieStore.set>[2]
```

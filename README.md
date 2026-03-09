# 🌊 SwimPulse

A single-file swim workout tracker that lives entirely in your browser — no install, no server, no dependencies.

![SwimPulse](image.png)

---

## What it does

**Screen 1 — Profile setup**
Enter your height, weight, age, and sex. SwimPulse calculates your BMI and uses your body weight to personalise every calorie estimate.

**Screen 2 — Workout tracker**
- Log swim sessions by stroke, intensity, and duration
- Calories calculated using MET values from the Compendium of Physical Activities
- Animated goal ring tracks daily progress toward a 500 kcal target
- Session history with timestamps, expandable and removable entries
- Stats bar — total meters, minutes, sessions, avg kcal/min
- Animated water-level background that rises as you burn calories

---

## Calorie formula

```
kcal = MET × weight_kg × duration_hours
```

| Stroke | Easy | Moderate | Hard |
|---|---|---|---|
| Freestyle | 5.8 | 7.0 | 10.0 |
| Breaststroke | 5.3 | 6.5 | 10.3 |
| Backstroke | 4.8 | 6.0 | 9.5 |
| Butterfly | 8.0 | 10.0 | 13.8 |
| Mixed | 5.5 | 7.0 | 9.5 |

---

## Usage

```bash
# Just open it
open index.html
```

No build step. No npm. No server. Works in any modern browser.

---

## Tech

- **Zero dependencies** — vanilla HTML, CSS, JS in a single file
- **CSS custom properties** for the ocean colour palette (`--deep`, `--ocean`, `--wave`, `--foam`, `--glow`, …)
- **SVG goal ring** with animated `stroke-dashoffset`
- **CSS transitions** for all interactive state (history expand, session confirm banner, water level)
- **In-memory state only** — refreshing clears everything (prototype behaviour)

---

## Project structure

Everything is in `index.html`:

| Lines | Section |
|---|---|
| 13–384 | CSS |
| 386–549 | HTML |
| 551–863 | JavaScript |

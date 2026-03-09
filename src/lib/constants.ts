import type { Stroke, Intensity } from './types'

export const MET: Record<Stroke, Record<Intensity, number>> = {
  freestyle:    { easy: 5.8, moderate: 7.0, hard: 10.0 },
  breaststroke: { easy: 5.3, moderate: 6.5, hard: 10.3 },
  backstroke:   { easy: 4.8, moderate: 6.0, hard:  9.5 },
  butterfly:    { easy: 8.0, moderate: 10.0, hard: 13.8 },
  mixed:        { easy: 5.5, moderate: 7.0, hard:  9.5 },
}

export const DAILY_GOAL_KCAL = 500

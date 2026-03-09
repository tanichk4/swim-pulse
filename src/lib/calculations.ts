import { MET } from './constants'
import type { Stroke, Intensity } from './types'

export function calcCalories(
  stroke: Stroke,
  intensity: Intensity,
  durationMin: number,
  weightKg: number,
): number {
  const met = MET[stroke]?.[intensity] ?? 8
  return Math.round(met * weightKg * (durationMin / 60))
}

export function calcBMI(weightKg: number, heightCm: number): number {
  return weightKg / (heightCm / 100) ** 2
}

export function bmiLabel(bmi: number): string {
  if (bmi < 18.5) return 'Underweight'
  if (bmi < 25) return 'Normal'
  if (bmi < 30) return 'Overweight'
  return 'Obese'
}

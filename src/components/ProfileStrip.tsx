'use client'

import { useRouter } from 'next/navigation'
import type { Profile } from '@/lib/types'

interface Props {
  profile: Profile
}

export default function ProfileStrip({ profile }: Props) {
  const router = useRouter()

  return (
    <div className="profile-strip">
      <div className="chip">
        <span className="chip-val">{profile.weight}</span> kg
      </div>
      <div className="divider" />
      <div className="chip">
        <span className="chip-val">{profile.height}</span> cm
      </div>
      <div className="divider" />
      <div className="chip bmi-chip">
        <span className="chip-val">{profile.bmi.toFixed(1)}</span> BMI
      </div>
      <button className="edit-btn" onClick={() => router.push('/onboarding')}>
        Edit
      </button>
    </div>
  )
}

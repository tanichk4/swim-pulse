'use client'

import { useEffect, useState } from 'react'

interface Props {
  lastLoggedAt: number | null
}

export default function SessionConfirm({ lastLoggedAt }: Props) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (!lastLoggedAt) return
    setVisible(true)
    const t = setTimeout(() => setVisible(false), 4000)
    return () => clearTimeout(t)
  }, [lastLoggedAt])

  return (
    <div className={`session-confirm${visible ? ' visible' : ''}`}>
      <div className="confirm-icon">✓</div>
      <div className="confirm-text">Session logged! Check your history below.</div>
    </div>
  )
}

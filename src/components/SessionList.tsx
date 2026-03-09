'use client'

import { useState } from 'react'
import type { Session } from '@/lib/types'

interface Props {
  sessions: Session[]
  onRemove: (id: string) => void
  onClearAll: () => void
}

export default function SessionList({ sessions, onRemove, onClearAll }: Props) {
  const [isOpen, setIsOpen] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [removingIds, setRemovingIds] = useState<Set<string>>(new Set())

  function handleRemoveClick(id: string) {
    setRemovingIds((prev) => new Set([...prev, id]))
    setTimeout(() => {
      onRemove(id)
      setRemovingIds((prev) => {
        const next = new Set(prev)
        next.delete(id)
        return next
      })
    }, 350)
  }

  function handleClearAllClick() {
    if (sessions.length === 0) return
    setShowConfirm(true)
  }

  function handleConfirmClear() {
    setShowConfirm(false)
    onClearAll()
  }

  return (
    <div className="history">
      <div className="history-header" id="historyHeader">
        <h2>
          Today&apos;s Sessions{' '}
          <span className={`session-badge${sessions.length > 0 ? ' visible' : ''}`}>
            {sessions.length}
          </span>
        </h2>
        <div className="history-actions">
          <button
            className={`clear-btn${sessions.length > 0 ? ' visible' : ''}`}
            onClick={handleClearAllClick}
            title="Clear all"
          >
            Clear all
          </button>
          <button
            className="toggle-btn"
            onClick={() => setIsOpen((o) => !o)}
          >
            <span className={`arrow${isOpen ? '' : ' collapsed'}`}>▾</span>
          </button>
        </div>
      </div>

      <div className={`session-list${isOpen ? '' : ' collapsed'}`}>
        {sessions.length === 0 ? (
          <div className="empty-state">No sessions yet — go make some waves!</div>
        ) : (
          sessions.map((s) => {
            const strokeLabel = s.stroke.charAt(0).toUpperCase() + s.stroke.slice(1)
            const intensityLabel = s.intensity.charAt(0).toUpperCase() + s.intensity.slice(1)
            const timeStr = new Date(s.created_at).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            })
            return (
              <div
                key={s.id}
                className={`session${removingIds.has(s.id) ? ' removing' : ''}`}
              >
                <div className="left">
                  <div className="stroke-name">{strokeLabel}</div>
                  <div className="meta">
                    {intensityLabel} · {s.duration} min · {timeStr}
                  </div>
                </div>
                <div className="mid">
                  <div className="kcal">{s.kcal} kcal</div>
                  <div className="dist">{s.distance.toLocaleString()} m</div>
                </div>
                <button
                  className="del-btn"
                  onClick={() => handleRemoveClick(s.id)}
                  title="Remove"
                >
                  ✕
                </button>
              </div>
            )
          })
        )}
      </div>

      {/* Confirm clear dialog */}
      <div className={`confirm-overlay${showConfirm ? ' visible' : ''}`}>
        <div className="confirm-box">
          <p>
            Remove all sessions?
            <br />
            This can&apos;t be undone.
          </p>
          <div className="confirm-actions">
            <button className="btn-cancel" onClick={() => setShowConfirm(false)}>
              Cancel
            </button>
            <button className="btn-confirm-del" onClick={handleConfirmClear}>
              Clear all
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

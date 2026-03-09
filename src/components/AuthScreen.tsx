'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { getSupabaseBrowserClient } from '@/lib/supabase/client'

type Mode = 'login' | 'signup'

export default function AuthScreen() {
  const router = useRouter()
  const [mode, setMode] = useState<Mode>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [toastMsg, setToastMsg] = useState<string | null>(null)
  const [checkEmail, setCheckEmail] = useState(false)
  const toastTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (!toastMsg) return
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current)
    toastTimerRef.current = setTimeout(() => setToastMsg(null), 3600)
    return () => {
      if (toastTimerRef.current) clearTimeout(toastTimerRef.current)
    }
  }, [toastMsg])

  async function handleEmailSubmit() {
    if (loading || !email || !password) return
    const supabase = getSupabaseBrowserClient()
    setLoading(true)
    setToastMsg(null)

    if (mode === 'login') {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) {
        setToastMsg(error.message)
        setLoading(false)
      } else {
        router.push('/tracker')
        router.refresh()
      }
    } else {
      const { data, error } = await supabase.auth.signUp({ email, password })
      if (error) {
        setToastMsg(error.message)
        setLoading(false)
      } else if (data.session) {
        router.push('/tracker')
        router.refresh()
      } else {
        setCheckEmail(true)
        setLoading(false)
      }
    }
  }

  async function handleGoogleSignIn() {
    const supabase = getSupabaseBrowserClient()
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    })
  }

  if (checkEmail) {
    return (
      <div id="screenOnboarding" className="screen active">
        <div className="onboarding-card">
          <div className="onboarding-logo">
            <h1>SwimPulse</h1>
            <p>Track · Burn · Recover</p>
          </div>
          <div className="onboarding-why">
            <p>
              Check your email for a confirmation link, then come back to sign in.
            </p>
          </div>
          <button
            className="btn-continue"
            onClick={() => { setCheckEmail(false); setMode('login') }}
          >
            Back to Sign In
          </button>
        </div>
      </div>
    )
  }

  return (
    <>
      <div id="screenOnboarding" className="screen active">
        <div className="onboarding-card">
          <div className="onboarding-logo">
            <h1>SwimPulse</h1>
            <p>Track · Burn · Recover</p>
          </div>

          <div className="onboarding-why">
            <p>{mode === 'login' ? 'Sign in to your account' : 'Create a new account'}</p>
          </div>

          <div className="onboarding-fields">
            <div className="onboarding-field">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleEmailSubmit()}
                autoComplete="email"
              />
            </div>

            <div className="onboarding-field">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                placeholder={mode === 'signup' ? 'Min. 6 characters' : '••••••••'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleEmailSubmit()}
                autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
              />
            </div>
          </div>

          <button
            className={`btn-continue${!email || !password ? ' btn-continue--locked' : ''}`}
            onClick={handleEmailSubmit}
            disabled={loading}
          >
            {loading ? '…' : mode === 'login' ? 'Sign In →' : 'Create Account →'}
          </button>

          <div style={{ textAlign: 'center', margin: '16px 0 12px', color: 'rgba(255,255,255,0.3)', fontSize: '0.75rem', letterSpacing: '1px' }}>
            OR
          </div>

          <button
            className="btn-continue"
            onClick={handleGoogleSignIn}
            disabled={loading}
            style={{ marginTop: 0 }}
          >
            Continue with Google
          </button>

          <p style={{ textAlign: 'center', marginTop: '20px', fontSize: '0.8rem', color: 'rgba(255,255,255,0.4)' }}>
            {mode === 'login' ? (
              <>
                Don&apos;t have an account?{' '}
                <button
                  onClick={() => setMode('signup')}
                  style={{ background: 'none', border: 'none', color: 'var(--foam)', cursor: 'pointer', fontSize: 'inherit', padding: 0 }}
                >
                  Sign up
                </button>
              </>
            ) : (
              <>
                Already have an account?{' '}
                <button
                  onClick={() => setMode('login')}
                  style={{ background: 'none', border: 'none', color: 'var(--foam)', cursor: 'pointer', fontSize: 'inherit', padding: 0 }}
                >
                  Sign in
                </button>
              </>
            )}
          </p>
        </div>
      </div>

      {toastMsg && (
        <div className="error-toast">
          <span className="toast-icon">⚠️</span>
          <span className="toast-msg">{toastMsg}</span>
          <button className="toast-close" onClick={() => setToastMsg(null)}>✕</button>
        </div>
      )}
    </>
  )
}

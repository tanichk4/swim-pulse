"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";

type Step = "splash" | "login" | "signup" | "checkEmail";

function SwimmerIllustration({ size = 180 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 180 180"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* Water surface waves */}
      <path
        d="M10 120 Q30 110 50 120 Q70 130 90 120 Q110 110 130 120 Q150 130 170 120"
        stroke="rgba(72,201,176,0.3)"
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
      />
      <path
        d="M20 128 Q40 118 60 128 Q80 138 100 128 Q120 118 140 128 Q155 134 165 128"
        stroke="rgba(72,201,176,0.18)"
        strokeWidth="1.5"
        fill="none"
        strokeLinecap="round"
      />

      {/* Head */}
      <circle
        cx="138"
        cy="97"
        r="10"
        fill="rgba(240,133,110,0.5)"
        stroke="rgba(240,133,110,0.7)"
        strokeWidth="1.5"
      />
      {/* Goggles */}
      <rect
        x="132"
        y="95"
        width="6"
        height="4"
        rx="2"
        fill="none"
        stroke="rgba(72,201,176,0.9)"
        strokeWidth="1.2"
      />
      <line
        x1="138"
        y1="97"
        x2="142"
        y2="97"
        stroke="rgba(72,201,176,0.9)"
        strokeWidth="1.2"
      />
      <rect
        x="142"
        y="95"
        width="6"
        height="4"
        rx="2"
        fill="none"
        stroke="rgba(72,201,176,0.9)"
        strokeWidth="1.2"
      />

      {/* Torso */}
      <path
        d="M128 100 Q110 105 90 103 Q70 101 55 106"
        stroke="rgba(72,201,176,0.75)"
        strokeWidth="5"
        strokeLinecap="round"
        fill="none"
      />

      {/* Leading arm */}
      <path
        d="M128 100 Q118 88 100 86 Q85 84 70 82"
        stroke="rgba(240,133,110,0.65)"
        strokeWidth="3.5"
        strokeLinecap="round"
        fill="none"
      />
      <ellipse
        cx="68"
        cy="82"
        rx="5"
        ry="3"
        fill="rgba(240,133,110,0.5)"
        transform="rotate(-15 68 82)"
      />

      {/* Recovery arm */}
      <path
        d="M128 100 Q140 90 148 80 Q152 74 148 70"
        stroke="rgba(240,133,110,0.45)"
        strokeWidth="3"
        strokeLinecap="round"
        fill="none"
      />

      {/* Legs */}
      <path
        d="M55 106 Q45 112 38 118 Q34 122 36 126"
        stroke="rgba(72,201,176,0.6)"
        strokeWidth="3.5"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M55 106 Q48 116 44 124 Q42 129 44 132"
        stroke="rgba(72,201,176,0.45)"
        strokeWidth="3"
        strokeLinecap="round"
        fill="none"
      />

      {/* Entry splash droplets */}
      <circle cx="63" cy="76" r="2" fill="rgba(72,201,176,0.5)" />
      <circle cx="58" cy="79" r="1.5" fill="rgba(72,201,176,0.4)" />
      <circle cx="72" cy="75" r="1.2" fill="rgba(72,201,176,0.35)" />

      {/* Bubbles */}
      <circle
        cx="118"
        cy="112"
        r="3.5"
        fill="none"
        stroke="rgba(72,201,176,0.35)"
        strokeWidth="1.2"
      />
      <circle
        cx="108"
        cy="116"
        r="2.5"
        fill="none"
        stroke="rgba(72,201,176,0.3)"
        strokeWidth="1"
      />
      <circle
        cx="98"
        cy="113"
        r="2"
        fill="none"
        stroke="rgba(72,201,176,0.25)"
        strokeWidth="1"
      />
      <circle
        cx="80"
        cy="116"
        r="3"
        fill="none"
        stroke="rgba(240,133,110,0.3)"
        strokeWidth="1"
      />
      <circle
        cx="70"
        cy="120"
        r="2"
        fill="none"
        stroke="rgba(240,133,110,0.25)"
        strokeWidth="1"
      />

      {/* Lane line accents */}
      <circle
        cx="30"
        cy="58"
        r="4"
        fill="rgba(72,201,176,0.15)"
        stroke="rgba(72,201,176,0.25)"
        strokeWidth="1"
      />
      <circle
        cx="50"
        cy="52"
        r="3"
        fill="rgba(240,133,110,0.12)"
        stroke="rgba(240,133,110,0.2)"
        strokeWidth="1"
      />
      <circle
        cx="155"
        cy="60"
        r="5"
        fill="rgba(72,201,176,0.1)"
        stroke="rgba(72,201,176,0.2)"
        strokeWidth="1"
      />
      <circle
        cx="165"
        cy="48"
        r="3"
        fill="rgba(240,133,110,0.12)"
        stroke="rgba(240,133,110,0.2)"
        strokeWidth="1"
      />
    </svg>
  );
}

const footerStyle: React.CSSProperties = {
  textAlign: "center",
  marginTop: "20px",
  fontSize: "0.8rem",
  color: "rgba(255,255,255,0.4)",
};
const linkStyle: React.CSSProperties = {
  background: "none",
  border: "none",
  color: "var(--foam)",
  cursor: "pointer",
  fontSize: "inherit",
  padding: 0,
};

export default function AuthScreen() {
  const router = useRouter();
  const [displayedStep, setDisplayedStep] = useState<Step>("splash");
  const [isExiting, setIsExiting] = useState(false);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const toastTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const transitionTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!toastMsg) return;
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    toastTimerRef.current = setTimeout(() => setToastMsg(null), 3600);
    return () => {
      if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    };
  }, [toastMsg]);

  useEffect(() => {
    return () => {
      if (transitionTimerRef.current) clearTimeout(transitionTimerRef.current);
    };
  }, []);

  function goTo(next: Step) {
    if (isExiting) return;
    setIsExiting(true);
    transitionTimerRef.current = setTimeout(() => {
      setDisplayedStep(next);
      setIsExiting(false);
    }, 220);
  }

  async function handleLogin() {
    if (loading || !email || !password) return;
    const supabase = getSupabaseBrowserClient();
    setLoading(true);
    setToastMsg(null);
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      setToastMsg(error.message);
      setLoading(false);
    } else {
      router.push("/tracker");
      router.refresh();
    }
  }

  async function handleSignup() {
    if (loading || !email || !password) return;
    const supabase = getSupabaseBrowserClient();
    setLoading(true);
    setToastMsg(null);
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName || undefined,
        },
      },
    });
    if (error) {
      setToastMsg(error.message);
      setLoading(false);
    } else if (data.session) {
      router.push("/tracker");
      router.refresh();
    } else {
      goTo("checkEmail");
      setLoading(false);
    }
  }

  const Toast = toastMsg ? (
    <div className="error-toast">
      <span className="toast-icon">⚠️</span>
      <span className="toast-msg">{toastMsg}</span>
      <button className="toast-close" onClick={() => setToastMsg(null)}>
        ✕
      </button>
    </div>
  ) : null;

  const contentClass = `auth-step-content${isExiting ? " auth-step-exit" : ""}`;

  return (
    <>
      <div id="screenOnboarding" className="screen active">
        <div
          className="onboarding-card"
          style={{
            position: "relative",
            textAlign: displayedStep === "splash" || displayedStep === "checkEmail" ? "center" : undefined,
          }}
        >
          {/* Back button — shown on login, signup */}
          {(displayedStep === "login" || displayedStep === "signup") && (
            <button
              className="auth-back-btn"
              onClick={() => goTo(displayedStep === "login" ? "splash" : "login")}
              aria-label="Back"
            >
              ←
            </button>
          )}

          <div className={contentClass}>
            {/* ── SPLASH ── */}
            {displayedStep === "splash" && (
              <>
                <div className="auth-splash-art" style={{ margin: "0 0 20px" }}>
                  <SwimmerIllustration size={180} />
                </div>
                <div className="onboarding-logo">
                  <h1>SwimPulse</h1>
                  <p>Track · Burn · Recover</p>
                </div>
                <p className="onboarding-why" style={{ margin: "12px 0 28px" }}>
                  &ldquo;Water is the driving force of all nature.&rdquo;
                </p>
                <button className="btn-continue" onClick={() => goTo("login")}>
                  Get Started
                </button>
              </>
            )}

            {/* ── CHECK EMAIL ── */}
            {displayedStep === "checkEmail" && (
              <>
                <div className="auth-splash-art">
                  <SwimmerIllustration size={120} />
                </div>
                <div className="onboarding-logo">
                  <h1>SwimPulse</h1>
                  <p>Track · Burn · Recover</p>
                </div>
                <p className="onboarding-why" style={{ margin: "16px 0 24px" }}>
                  Check your email for a confirmation link, then come back to sign in.
                </p>
                <button className="btn-continue" onClick={() => goTo("login")}>
                  Back to Sign In
                </button>
              </>
            )}

            {/* ── LOGIN ── */}
            {displayedStep === "login" && (
              <>
                <div className="onboarding-logo" style={{ marginBottom: "4px" }}>
                  <h1 style={{ fontSize: "1.9rem" }}>SwimPulse</h1>
                  <p>Track · Burn · Recover</p>
                </div>

                <div className="auth-splash-art" style={{ margin: "4px 0 16px" }}>
                  <SwimmerIllustration size={110} />
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
                      onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                      autoComplete="email"
                    />
                  </div>
                  <div className="onboarding-field">
                    <label htmlFor="password">Password</label>
                    <input
                      id="password"
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                      autoComplete="current-password"
                    />
                  </div>
                </div>

                <button
                  className={`btn-continue${!email || !password ? " btn-continue--locked" : ""}`}
                  onClick={handleLogin}
                  disabled={loading}
                >
                  {loading ? "…" : "Sign In"}
                </button>

                <p style={footerStyle}>
                  Don&apos;t have an account?{" "}
                  <button style={linkStyle} onClick={() => goTo("signup")}>
                    Create New
                  </button>
                </p>
              </>
            )}

            {/* ── SIGN UP ── */}
            {displayedStep === "signup" && (
              <>
                <div className="onboarding-logo" style={{ marginBottom: "4px" }}>
                  <h1 style={{ fontSize: "1.9rem" }}>SwimPulse</h1>
                  <p>Track · Burn · Recover</p>
                </div>

                <div className="auth-splash-art" style={{ margin: "4px 0 16px" }}>
                  <SwimmerIllustration size={110} />
                </div>

                <div className="onboarding-fields">
                  <div className="onboarding-field">
                    <label htmlFor="fullName">Full Name</label>
                    <input
                      id="fullName"
                      type="text"
                      placeholder="Jane Swimmer"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      autoComplete="name"
                    />
                  </div>
                  <div className="onboarding-field">
                    <label htmlFor="signupEmail">Email</label>
                    <input
                      id="signupEmail"
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      autoComplete="email"
                    />
                  </div>
                  <div className="onboarding-field">
                    <label htmlFor="signupPassword">Password</label>
                    <input
                      id="signupPassword"
                      type="password"
                      placeholder="Min. 6 characters"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleSignup()}
                      autoComplete="new-password"
                    />
                  </div>
                </div>

                <button
                  className={`btn-continue${!email || !password ? " btn-continue--locked" : ""}`}
                  onClick={handleSignup}
                  disabled={loading}
                >
                  {loading ? "…" : "Create Account →"}
                </button>

                <p style={footerStyle}>
                  Already have an account?{" "}
                  <button style={linkStyle} onClick={() => goTo("login")}>
                    Login
                  </button>
                </p>
              </>
            )}
          </div>
        </div>
      </div>
      {Toast}
    </>
  );
}

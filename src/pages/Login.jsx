import React, { useState } from 'react'
import { useDemo } from '../data/DemoContext.jsx'

// PDD 4.8 sign-in, mocked without a real mail server: in production this
// email step ends with a one-time magic link; here, submitting the email
// signs you straight in (or explains why not) so the return-visit and
// deactivation-lockout behavior can be demoed without a backend.
export default function Login() {
  const { login, users } = useDemo()
  const [email, setEmail] = useState('')
  const [result, setResult] = useState(null) // { status, user? }

  function handleSubmit(e) {
    e.preventDefault()
    if (!email.trim()) return
    setResult(login(email))
  }

  function quickLogin(userEmail) {
    setEmail(userEmail)
    setResult(login(userEmail))
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-ink-50 px-4 py-10">
      <div className="w-full max-w-md space-y-6">
        <div className="flex flex-col items-center gap-2 text-center">
          <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-brand-600 text-sm font-bold text-white">
            CI
          </div>
          <div>
            <div className="text-base font-semibold text-ink-900">Biovergence</div>
            <div className="text-xs text-ink-500">Community Intelligence Platform</div>
          </div>
        </div>

        <div className="card space-y-4 p-6">
          <div>
            <h1 className="text-lg font-semibold text-ink-900">Sign in</h1>
            <p className="mt-1 text-xs text-ink-500">
              Enter the email address your invite was sent to. In the live product this sends a one-time magic link;
              for this demo, entering it signs you in directly.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label className="label">Email</label>
              <input
                className="input"
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value)
                  setResult(null)
                }}
                required
              />
            </div>
            <button type="submit" className="btn-primary w-full">
              Continue
            </button>
          </form>

          {result?.status === 'not-found' && (
            <p className="rounded-lg bg-rose-50 px-3 py-2 text-xs text-rose-600">
              We don't recognize that email. Ask your Community Ambassador for an invite.
            </p>
          )}
          {result?.status === 'deactivated' && (
            <p className="rounded-lg bg-rose-50 px-3 py-2 text-xs text-rose-600">
              {result.user?.name || 'This account'}'s access has been deactivated. Contact your Community Ambassador
              if you believe this is a mistake.
              <span className="mt-1 block text-[11px] text-rose-500">
                (User Needs Register UN-GEN-18: MVP1 doesn't yet email an explanation when this happens.)
              </span>
            </p>
          )}
        </div>

        <div className="card space-y-3 p-5">
          <div>
            <h2 className="text-xs font-semibold uppercase tracking-wide text-ink-500">Demo shortcuts</h2>
            <p className="mt-1 text-[11px] text-ink-400">
              For this demo only — not part of the client-facing product. Signs in as any seeded contributor,
              including a deactivated one, so the lock-out above can be shown without typing an email.
            </p>
          </div>
          <div className="grid gap-1.5">
            {users.map((u) => (
              <button
                key={u.id}
                type="button"
                onClick={() => quickLogin(u.email)}
                className="flex items-center justify-between rounded-lg border border-ink-200 bg-white px-3 py-2 text-left text-xs hover:border-brand-300 hover:bg-brand-50"
              >
                <span>
                  <span className="font-medium text-ink-800">{u.name}</span>{' '}
                  <span className="text-ink-400">· {u.roles.join(', ')}</span>
                </span>
                {u.administrativeStatus === 'Deactivated' && (
                  <span className="badge bg-rose-100 text-rose-600">Deactivated</span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

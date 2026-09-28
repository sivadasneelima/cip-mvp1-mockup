import React, { useEffect, useRef } from 'react'
import { Navigate } from 'react-router-dom'
import { useDemo } from '../data/DemoContext.jsx'

// Client-side stand-in for the server-side RBAC enforcement required by PDD
// Section 7.1 ("contributors only ever see missions, Candidates, forms, and
// data scoped to their own invitations"). In the real system this check lives
// on the server; here it re-runs whenever `role` changes — signing in as a
// different person (Login/logout, Phase 5) or switching hats via the
// header's "Acting as" control for someone who holds more than one role —
// so landing on a role-restricted screen you no longer have access to kicks
// you back to the dashboard instead of leaving a stale, unauthorized view on
// screen — e.g. an Admin's kill-gate determination controls staying visible
// after signing out and a Community Ambassador signing in on the same tab.
export default function RequireRole({ allow, children }) {
  const { role, currentUser } = useDemo()
  const allowed = allow.includes(role)
  const warnedRef = useRef(false)

  useEffect(() => {
    if (!allowed && !warnedRef.current) {
      warnedRef.current = true
      // eslint-disable-next-line no-console
      console.warn(`Blocked: "${role}" (${currentUser.name}) attempted to view a screen restricted to: ${allow.join(', ')}`)
    }
    if (allowed) warnedRef.current = false
  }, [allowed, role, currentUser.name, allow])

  if (!allowed) {
    return <Navigate to="/" replace />
  }

  return children
}

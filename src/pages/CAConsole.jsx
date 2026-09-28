import React, { useState } from 'react'
import { useDemo } from '../data/DemoContext.jsx'
import { Badge, CandidateStatusBadge } from '../components/StatusBadge.jsx'
import { daysUntil, isMissionOpen } from '../lib/deadlines.js'

// PDD 4.7: submission status against the mission/role deadline — Expired
// once the deadline has passed with no Active submission on file. This
// mockup only has a mission-level deadline (no separate per-role deadline
// yet), so "the deadline" here means the mission's own.
function statusForContributor(userId, mission, contributions) {
  const mine = contributions.find((c) => c.contributorId === userId && c.missionId === mission.id)
  if (mine) return 'Completed'
  if (!isMissionOpen(mission)) return 'Expired'
  return 'Tasked'
}

const STATUS_TONE = { Completed: 'brand', Expired: 'rose', Tasked: 'amber' }

export default function CAConsole() {
  const { validationMissions, contributions, getCandidate, getUser } = useDemo()
  const [inviteEmail, setInviteEmail] = useState('')
  const [invited, setInvited] = useState([])

  function sendInvite(e) {
    e.preventDefault()
    if (!inviteEmail.trim()) return
    setInvited((prev) => [...prev, inviteEmail.trim()])
    setInviteEmail('')
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-ink-900">Community console</h1>
        <p className="mt-1 text-sm text-ink-600">
          View submission status across your assigned missions, send reminders, and invite new participants.
        </p>
      </div>

      <div className="card p-5">
        <h2 className="mb-3 text-sm font-semibold text-ink-900">Invite a participant</h2>
        <form onSubmit={sendInvite} className="flex flex-wrap gap-2">
          <input
            className="input max-w-xs"
            type="email"
            placeholder="name@example.com"
            value={inviteEmail}
            onChange={(e) => setInviteEmail(e.target.value)}
          />
          <button type="submit" className="btn-primary">
            Send magic-link invitation
          </button>
        </form>
        {invited.length > 0 && (
          <ul className="mt-3 space-y-1 text-xs text-ink-500">
            {invited.map((email) => (
              <li key={email}>Invitation queued for {email} (expires in 7 days, single-use).</li>
            ))}
          </ul>
        )}
      </div>

      <div className="space-y-4">
        {validationMissions.map((m) => {
          const candidate = getCandidate(m.candidateId)
          const open = isMissionOpen(m)
          const days = daysUntil(m.deadline)
          return (
            <div key={m.id} className="card p-5">
              <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                <div>
                  <div className="text-sm font-semibold text-ink-900">{candidate?.title}</div>
                  <div className="text-xs text-ink-400">{m.id} · {m.status}</div>
                </div>
                <div className="flex items-center gap-2">
                  {m.deadline && (
                    <span className={`text-xs font-medium ${open && days <= 2 ? 'text-amber-600' : 'text-ink-500'}`}>
                      {open ? `Deadline ${m.deadline} (${days} day${days === 1 ? '' : 's'} left)` : `Deadline ${m.deadline} — passed`}
                    </span>
                  )}
                  <CandidateStatusBadge candidate={candidate} />
                </div>
              </div>
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="text-xs uppercase tracking-wide text-ink-400">
                    <th className="py-1 font-medium">Contributor</th>
                    <th className="py-1 font-medium">Role</th>
                    <th className="py-1 font-medium">Deadline</th>
                    <th className="py-1 font-medium">Status</th>
                    <th className="py-1 font-medium"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-ink-100">
                  {m.contributors.map((contrib) => {
                    const user = getUser(contrib.userId)
                    const status = statusForContributor(contrib.userId, m, contributions)
                    return (
                      <tr key={contrib.userId}>
                        <td className="py-2">{user?.name}</td>
                        <td className="py-2 text-ink-500">{contrib.role}</td>
                        <td className="py-2 text-ink-500">{m.deadline || '—'}</td>
                        <td className="py-2">
                          <Badge tone={STATUS_TONE[status] || 'ink'}>{status}</Badge>
                        </td>
                        <td className="py-2 text-right">
                          {status === 'Tasked' && (
                            <button className="text-xs font-medium text-brand-600 hover:underline">
                              Send reminder (due {m.deadline})
                            </button>
                          )}
                          {status === 'Expired' && (
                            <span className="text-xs text-ink-400">Deadline passed — no submission on file</span>
                          )}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )
        })}
      </div>
    </div>
  )
}

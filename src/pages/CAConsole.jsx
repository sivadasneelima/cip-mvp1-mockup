import React, { useState } from 'react'
import { useDemo } from '../data/DemoContext.jsx'
import { getUser, getCandidate } from '../data/mockData.js'
import { Badge, CandidateStatusBadge } from '../components/StatusBadge.jsx'

function statusForContributor(userId, missionId, contributions) {
  const mine = contributions.find((c) => c.contributorId === userId && c.missionId === missionId)
  if (mine) return 'Completed'
  return 'Tasked'
}

export default function CAConsole() {
  const { validationMissions, contributions } = useDemo()
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
          return (
            <div key={m.id} className="card p-5">
              <div className="mb-3 flex items-center justify-between">
                <div>
                  <div className="text-sm font-semibold text-ink-900">{candidate?.title}</div>
                  <div className="text-xs text-ink-400">{m.id} · {m.status}</div>
                </div>
                <CandidateStatusBadge status={candidate?.status} />
              </div>
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="text-xs uppercase tracking-wide text-ink-400">
                    <th className="py-1 font-medium">Contributor</th>
                    <th className="py-1 font-medium">Role</th>
                    <th className="py-1 font-medium">Status</th>
                    <th className="py-1 font-medium"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-ink-100">
                  {m.contributors.map((contrib) => {
                    const user = getUser(contrib.userId)
                    const status = statusForContributor(contrib.userId, m.id, contributions)
                    return (
                      <tr key={contrib.userId}>
                        <td className="py-2">{user?.name}</td>
                        <td className="py-2 text-ink-500">{contrib.role}</td>
                        <td className="py-2">
                          <Badge tone={status === 'Completed' ? 'brand' : 'amber'}>{status}</Badge>
                        </td>
                        <td className="py-2 text-right">
                          {status !== 'Completed' && (
                            <button className="text-xs font-medium text-brand-600 hover:underline">
                              Send reminder
                            </button>
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

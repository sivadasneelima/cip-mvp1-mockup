import React from 'react'
import { Link } from 'react-router-dom'
import { useDemo } from '../data/DemoContext.jsx'
import { CandidateStatusBadge, MissionStatusBadge, Badge } from '../components/StatusBadge.jsx'

export default function AdminMissions() {
  const { ideationMissions, validationMissions, candidates } = useDemo()

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-xl font-semibold text-ink-900">Missions &amp; candidates</h1>
        <p className="mt-1 text-sm text-ink-600">
          Define missions, review the Candidate pool, and open a Candidate to evaluate its kill-gate.
        </p>
      </div>

      <div>
        <div className="mb-2 flex items-center justify-between">
          <h2 className="section-title">Ideation missions</h2>
          <button className="btn-secondary text-xs">+ New ideation mission</button>
        </div>
        <div className="card divide-y divide-ink-100">
          {ideationMissions.map((m) => (
            <div key={m.id} className="flex items-center justify-between px-4 py-3">
              <div>
                <div className="text-sm font-medium text-ink-900">{m.title}</div>
                <div className="text-xs text-ink-400">{m.createdDate}</div>
              </div>
              <div className="flex items-center gap-3">
                <MissionStatusBadge status={m.status} />
                <Link to={`/admin/triage/${m.id}`} className="btn-secondary text-xs">
                  Open triage
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h2 className="section-title mb-2">Candidate pool</h2>
        <div className="card overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-ink-100 text-xs uppercase tracking-wide text-ink-400">
                <th className="px-4 py-2 font-medium">Candidate</th>
                <th className="px-4 py-2 font-medium">Source</th>
                <th className="px-4 py-2 font-medium">Status</th>
                <th className="px-4 py-2 font-medium">Validation mission</th>
                <th className="px-4 py-2 font-medium"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink-100">
              {candidates.map((c) => (
                <tr key={c.id}>
                  <td className="px-4 py-3">
                    <div className="font-medium text-ink-900">{c.title}</div>
                    <div className="text-xs text-ink-400">{c.id}</div>
                  </td>
                  <td className="px-4 py-3 text-xs text-ink-500">{c.sourceType}</td>
                  <td className="px-4 py-3">
                    <CandidateStatusBadge status={c.status} />
                  </td>
                  <td className="px-4 py-3 text-xs text-ink-500">{c.validationMissionId || '—'}</td>
                  <td className="px-4 py-3 text-right">
                    {c.status === 'Gated' ? (
                      <Link to={`/admin/gate/${c.id}`} className="text-xs font-medium text-brand-600 hover:underline">
                        Evaluate gate →
                      </Link>
                    ) : c.status === 'Active' && c.validationMissionId ? (
                      <div className="flex flex-col items-end gap-1">
                        <Link
                          to={`/admin/gate/${c.id}`}
                          className="text-xs font-medium text-amber-600 hover:underline"
                        >
                          Close input &amp; evaluate →
                        </Link>
                        <Link
                          to={`/validation/${c.validationMissionId}`}
                          className="text-xs font-medium text-ink-400 hover:underline"
                        >
                          View mission →
                        </Link>
                      </div>
                    ) : c.validationMissionId ? (
                      <Link to={`/validation/${c.validationMissionId}`} className="text-xs font-medium text-ink-500 hover:underline">
                        View mission →
                      </Link>
                    ) : (
                      <Badge tone="ink">No mission</Badge>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

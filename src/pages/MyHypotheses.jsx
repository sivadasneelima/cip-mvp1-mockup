import React from 'react'
import { Link } from 'react-router-dom'
import { useDemo } from '../data/DemoContext.jsx'
import { MemberCandidateStatusBadge } from '../components/StatusBadge.jsx'
import { isMissionOpen } from '../lib/deadlines.js'

// Disposition sentences, not bare badges — realizes UN-SCT-05 / UN-SCT-07
// (what became of the idea, in language, not just a status pill).
function dispositionLine(candidate) {
  switch (candidate.status) {
    case 'Proposed':
      return 'Submitted — awaiting Admin triage.'
    case 'Merged':
      return `Merged into ${candidate.mergedIntoId || 'another Candidate'} — you are recorded as a co-author.`
    case 'Suspended':
      return candidate.statusReasonCode === 'parked-at-gate'
        ? 'Parked during validation — kept on file, not discarded.'
        : 'Not taken forward this time — kept on file and retrievable for a later mission.'
    case 'Shortlisted':
    case 'Active':
      return 'Shortlisted and moved into validation.'
    case 'Gated':
      return 'Input collection closed — awaiting the Admin’s kill-gate determination.'
    case 'InValidation':
      return 'Advanced past the kill-gate — now being validated further.'
    case 'Resolved':
      return 'Advanced through validation and resolved.'
    default:
      return 'Under review by the team.'
  }
}

export default function MyHypotheses() {
  const { candidates, currentUser, ideationMissions } = useDemo()
  const mine = candidates.filter((c) => c.submittedBy === currentUser.id)

  const byMission = ideationMissions
    .map((m) => ({ mission: m, items: mine.filter((c) => c.parentMissionId === m.id) }))
    .filter((g) => g.items.length > 0)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-ink-900">My hypotheses</h1>
        <p className="mt-1 text-sm text-ink-600">Everything you have put forward, and where it stands.</p>
      </div>

      {byMission.length === 0 && (
        <div className="card p-6 text-sm text-ink-500">You haven't submitted any hypotheses yet.</div>
      )}

      {byMission.map(({ mission, items }) => (
        <div key={mission.id} className="card overflow-hidden">
          <div className="flex flex-wrap items-baseline gap-2 bg-ink-50 px-5 py-3">
            <span className="text-xs font-semibold tracking-wide text-ink-400">{mission.id}</span>
            <span className="text-sm font-semibold text-ink-900">{mission.title}</span>
            <span className="ml-auto text-xs text-ink-400">
              {isMissionOpen(mission) ? `Open until ${mission.deadline}` : `Closed · ${mission.status}`}
            </span>
          </div>
          <div className="divide-y divide-ink-100">
            {items.map((c) => (
              <div key={c.id} className="flex flex-wrap items-center gap-3 px-5 py-4">
                <span className="text-xs font-semibold text-brand-600">{c.id}</span>
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-medium text-ink-900">{c.title}</div>
                  <div className="text-xs text-ink-500">{dispositionLine(c)}</div>
                </div>
                <span className="text-xs text-ink-400">Submitted {c.createdDate}</span>
                <MemberCandidateStatusBadge candidate={c} />
                {isMissionOpen(mission) && (
                  <Link to={`/ideation/${mission.id}/submit`} className="text-xs font-medium text-brand-600 hover:underline">
                    Update
                  </Link>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

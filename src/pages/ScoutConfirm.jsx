import React from 'react'
import { Link, useParams } from 'react-router-dom'
import { useDemo } from '../data/DemoContext.jsx'
import { MemberCandidateStatusBadge } from '../components/StatusBadge.jsx'

export default function ScoutConfirm() {
  const { missionId, candidateId } = useParams()
  const { getIdeationMission, getCandidate } = useDemo()
  const mission = getIdeationMission(missionId)
  const candidate = getCandidate(candidateId)

  if (!mission || !candidate) {
    return <div className="card p-6 text-sm text-ink-500">Submission not found.</div>
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="card p-8">
        <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-brand-100 text-2xl text-brand-600">✓</div>
        <h1 className="mb-2 text-2xl font-semibold text-ink-900">Hypothesis submitted</h1>
        <p className="mb-6 text-sm text-ink-600">
          Recorded against {mission.id} as <span className="font-semibold text-brand-600">{candidate.id}</span>. Its
          status is visible on your dashboard from now until the mission is triaged.
        </p>

        <div className="mb-6 rounded-lg border border-ink-100 bg-ink-50 p-4">
          <div className="mb-2 flex flex-wrap items-center gap-2">
            <MemberCandidateStatusBadge candidate={candidate} />
            <span className="text-xs text-ink-400">Submitted {candidate.createdDate}</span>
          </div>
          <div className="text-base font-semibold text-ink-900">{candidate.title}</div>
        </div>

        <h2 className="mb-3 text-sm font-semibold text-ink-900">What happens next</h2>
        <div className="mb-8 space-y-3">
          <div className="flex gap-3">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-600 text-xs font-bold text-white">1</span>
            <p className="text-sm text-ink-600"><strong className="text-ink-900">Submissions close {mission.deadline}.</strong> You can add more hypotheses or update this one until then.</p>
          </div>
          <div className="flex gap-3">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-ink-300 text-xs font-bold text-white">2</span>
            <p className="text-sm text-ink-600"><strong className="text-ink-900">The team triages the pool.</strong> Duplicates are merged — you keep attribution as a co-author — and a small set is shortlisted.</p>
          </div>
          <div className="flex gap-3">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-ink-300 text-xs font-bold text-white">3</span>
            <p className="text-sm text-ink-600"><strong className="text-ink-900">You are told the outcome.</strong> Shortlisted, merged, or not selected — shown on your dashboard once the mission closes.</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <Link to={`/ideation/${missionId}/submit`} className="btn-primary">Add another hypothesis</Link>
          <Link to="/my-hypotheses" className="btn-secondary">View my hypotheses</Link>
        </div>
      </div>
    </div>
  )
}

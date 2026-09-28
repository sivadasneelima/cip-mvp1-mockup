import React from 'react'
import { Link, useParams } from 'react-router-dom'
import { useDemo } from '../data/DemoContext.jsx'
import { Badge } from '../components/StatusBadge.jsx'
import QAThread from '../components/QAThread.jsx'
import { daysUntil, isMissionOpen } from '../lib/deadlines.js'

// Mission brief — split out from the submission form so a Scout can read the
// prompt, the scope, and the Q&A thread without the form fields in view.
// Mirrors the client-supplied Scout prototype's own "brief" screen.
export function countdownTone(mission) {
  const open = isMissionOpen(mission)
  const days = daysUntil(mission.deadline)
  if (!open) return { bg: 'bg-ink-100', border: 'border-ink-200', fg: 'text-ink-500', big: 'Closed', small: 'SUBMISSIONS ENDED' }
  if (days <= 2) return { bg: 'bg-amber-100', border: 'border-amber-400', fg: 'text-amber-700', big: String(days), small: days === 1 ? 'DAY LEFT TO SUBMIT' : 'DAYS LEFT TO SUBMIT' }
  return { bg: 'bg-brand-100', border: 'border-brand-400', fg: 'text-brand-700', big: String(days), small: 'DAYS LEFT TO SUBMIT' }
}

export function CountdownCard({ mission }) {
  const t = countdownTone(mission)
  return (
    <div className={`rounded-lg border px-4 py-3 text-center ${t.bg} ${t.border}`}>
      <div className={`text-2xl font-bold leading-tight ${t.fg}`}>{t.big}</div>
      <div className={`mt-1 text-xs font-semibold tracking-wide ${t.fg}`}>{t.small}</div>
    </div>
  )
}

export default function ScoutMission() {
  const { missionId } = useParams()
  const { candidates, currentUser, getIdeationMission } = useDemo()
  const mission = getIdeationMission(missionId)

  if (!mission) return <div className="card p-6 text-sm text-ink-500">Mission not found.</div>

  const myCandidates = candidates.filter((c) => c.parentMissionId === missionId && c.submittedBy === currentUser.id)
  const missionClosed = !isMissionOpen(mission)

  return (
    <div className="space-y-6">
      <div className="text-xs text-ink-400">
        <Link to="/" className="hover:underline">Dashboard</Link> <span className="text-ink-300">/</span> {mission.id}
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.3fr,1fr]">
        <div className="space-y-4">
          <div className="card p-6">
            <div className="mb-3 flex flex-wrap items-center gap-2">
              <Badge tone="brand">Scout</Badge>
              <span className="text-xs font-medium tracking-wide text-ink-400">IDEATION MISSION {mission.id}</span>
            </div>
            <h1 className="mb-4 text-xl font-semibold text-ink-900">{mission.title}</h1>
            <div className="mb-5 rounded-lg bg-brand-50 p-4">
              <div className="mb-1 text-xs font-semibold tracking-wide text-ink-500">THE PROMPT</div>
              <div className="text-base font-medium text-ink-800">{mission.prompt}</div>
            </div>
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <div className="mb-2 text-sm font-semibold text-ink-900">In scope</div>
                <ul className="space-y-1.5 text-sm text-ink-600">
                  {(mission.inScope || []).map((line, i) => (
                    <li key={i} className="flex gap-2">
                      <span className="text-brand-600">✓</span>
                      <span>{line}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <div className="mb-2 text-sm font-semibold text-ink-900">Out of scope</div>
                <ul className="space-y-1.5 text-sm text-ink-600">
                  {(mission.outOfScope || []).map((line, i) => (
                    <li key={i} className="flex gap-2">
                      <span className="text-ink-400">—</span>
                      <span>{line}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <div className="card p-6">
            <h2 className="mb-3 text-sm font-semibold text-ink-900">What a submission contains</h2>
            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-lg border border-ink-100 p-3">
                <div className="mb-1 text-xs font-semibold text-brand-600">Title and hypothesis</div>
                <p className="text-xs text-ink-500">One clear claim, independently evaluable.</p>
              </div>
              <div className="rounded-lg border border-ink-100 p-3">
                <div className="mb-1 text-xs font-semibold text-brand-600">Supporting rationale</div>
                <p className="text-xs text-ink-500">The reasoning behind it, not just the headline.</p>
              </div>
              <div className="rounded-lg border border-ink-100 p-3">
                <div className="mb-1 text-xs font-semibold text-brand-600">Evidence — required</div>
                <p className="text-xs text-ink-500">Source links and/or an uploaded document.</p>
              </div>
            </div>
          </div>

          <QAThread threadKey={missionId} roleScope="Scout" />
        </div>

        <div className="space-y-4">
          <div className="card p-5">
            <CountdownCard mission={mission} />
            <p className="mt-3 text-xs text-ink-500">
              {missionClosed
                ? 'This mission is in triage. You will see the outcome of each hypothesis on your dashboard.'
                : `Submissions close ${mission.deadline}. After that the team begins triage.`}
            </p>
            {missionClosed ? (
              <div className="btn-secondary mt-4 w-full cursor-not-allowed text-center opacity-60">Submissions have closed</div>
            ) : (
              <Link to={`/ideation/${mission.id}/submit`} className="btn-primary mt-4 block w-full text-center">
                Submit a hypothesis
              </Link>
            )}
            <p className="mt-2 text-center text-xs text-ink-400">
              {missionClosed ? '' : 'As many as you like — unrelated hypotheses are expected.'}
            </p>
          </div>

          <div className="card p-5">
            <div className="mb-2 flex items-baseline justify-between">
              <h2 className="text-sm font-semibold text-ink-900">Your hypotheses</h2>
              <span className="text-xs text-ink-400">{myCandidates.length === 0 ? 'None yet' : `${myCandidates.length} submitted`}</span>
            </div>
            {myCandidates.length === 0 ? (
              <p className="text-xs text-ink-500">Nothing submitted yet. Scouts commonly file three or four unrelated hypotheses on one mission.</p>
            ) : (
              <div className="space-y-2">
                {myCandidates.map((c) => (
                  <div key={c.id} className="rounded-lg border border-ink-100 p-3">
                    <div className="mb-1 text-sm font-medium text-ink-900">{c.title}</div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-ink-500">{c.status}</span>
                      {!missionClosed && (
                        <Link to={`/ideation/${mission.id}/submit`} className="text-xs font-medium text-brand-600 hover:underline">
                          Update
                        </Link>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

import React, { useMemo, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useDemo } from '../data/DemoContext.jsx'
import { getCandidate, getUser } from '../data/mockData.js'
import { CandidateStatusBadge, Badge } from '../components/StatusBadge.jsx'

function median(nums) {
  if (!nums.length) return null
  const sorted = [...nums].sort((a, b) => a - b)
  const mid = Math.floor(sorted.length / 2)
  return sorted.length % 2 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2
}

function TallyBlock({ gate, activeContributions }) {
  if (gate.boundField === 'recommendation') {
    const counts = { Advance: 0, 'Do not advance (hold)': 0, 'More evidence is required': 0 }
    activeContributions.forEach((c) => {
      if (c.content?.recommendation && counts[c.content.recommendation] !== undefined) {
        counts[c.content.recommendation] += 1
      }
    })
    const total = Object.values(counts).reduce((a, b) => a + b, 0)
    return (
      <div className="space-y-2">
        {Object.entries(counts).map(([label, n]) => (
          <div key={label}>
            <div className="mb-1 flex items-center justify-between text-xs text-ink-500">
              <span>{label}</span>
              <span>
                {n} / {total}
              </span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-ink-100">
              <div
                className={`h-full ${label === 'Advance' ? 'bg-brand-500' : label.startsWith('Do not') ? 'bg-rose-600' : 'bg-amber-500'}`}
                style={{ width: total ? `${(n / total) * 100}%` : '0%' }}
              />
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (gate.boundField === 'conversionProbability') {
    const values = activeContributions
      .filter((c) => typeof c.content?.conversionProbability === 'number')
      .map((c) => c.content.conversionProbability)
    return (
      <div className="text-sm text-ink-700">
        Median predictor estimate: <span className="font-semibold">{median(values) ?? '—'}%</span>{' '}
        <span className="text-xs text-ink-400">({values.length} submissions: {values.join('%, ')}%)</span>
      </div>
    )
  }

  return (
    <div className="text-sm text-ink-500">
      No field binding configured — this gate is evaluated qualitatively from the submissions and evidence below.
    </div>
  )
}

export default function AdminKillGate() {
  const { candidateId } = useParams()
  const navigate = useNavigate()
  const { validationMissions, contributions, recordDetermination, closeInputAndEvaluate } = useDemo()
  const candidate = getCandidate(candidateId)
  const mission = validationMissions.find((m) => m.candidateId === candidateId)

  const [rationale, setRationale] = useState('')
  const [decision, setDecision] = useState(null)

  const activeContributions = useMemo(
    () => (mission ? contributions.filter((c) => c.missionId === mission.id && c.status === 'Active') : []),
    [mission, contributions],
  )

  if (!candidate) return <div className="card p-6 text-sm text-ink-500">Candidate not found.</div>
  if (!mission) return <div className="card p-6 text-sm text-ink-500">No Validation Mission found for this Candidate.</div>

  const canEvaluate = candidate.status === 'Gated'

  function submitDetermination(e) {
    e.preventDefault()
    if (!decision || !rationale.trim()) return
    recordDetermination({
      candidateId: candidate.id,
      missionId: mission.id,
      determination: decision,
      rationale: rationale.trim(),
      gateSnapshot: mission.killGates,
      tallySnapshot: activeContributions.map((c) => ({ role: c.role, content: c.content })),
    })
    navigate('/admin/missions')
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <Badge tone="amber">Kill-gate evaluation</Badge>
          <h1 className="mt-2 text-xl font-semibold text-ink-900">{candidate.title}</h1>
          <p className="mt-2 max-w-2xl text-sm text-ink-600">{candidate.hypothesis}</p>
        </div>
        <CandidateStatusBadge status={candidate.status} />
      </div>

      {!canEvaluate && (
        <div className="card p-5">
          <p className="text-sm text-ink-600">
            This Candidate's mission is still <strong>{mission.status}</strong>. Close input collection to move it
            to Under Review before recording a determination.
          </p>
          {mission.status === 'Active' && (
            <button
              className="btn-secondary mt-3 text-xs"
              onClick={() => closeInputAndEvaluate(mission.id, candidate.id)}
            >
              Close input &amp; evaluate
            </button>
          )}
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-[1.1fr,1fr]">
        <div className="space-y-4">
          <div className="card p-5">
            <h2 className="mb-3 text-sm font-semibold text-ink-900">Configured kill-gates</h2>
            <div className="space-y-5">
              {mission.killGates.map((gate) => (
                <div key={gate.id} className="border-b border-ink-100 pb-4 last:border-0 last:pb-0">
                  <div className="mb-1 flex items-center justify-between">
                    <span className="text-sm font-medium text-ink-900">{gate.label}</span>
                    <Badge tone={gate.type === 'quantitative' ? 'brand' : 'ink'}>{gate.type}</Badge>
                  </div>
                  <div className="mb-2 text-xs text-ink-400">Threshold (reference only): {gate.threshold}</div>
                  <TallyBlock gate={gate} activeContributions={activeContributions} />
                </div>
              ))}
            </div>
            <p className="mt-4 text-xs text-ink-400">
              MVP 1 displays tallies for decision support only — it performs no threshold comparison and issues no
              recommendation. The determination below is entirely yours.
            </p>
          </div>

          <div className="card p-5">
            <h2 className="mb-3 text-sm font-semibold text-ink-900">Underlying submissions &amp; evidence</h2>
            <div className="space-y-3">
              {activeContributions.map((c) => (
                <div key={c.id} className="rounded-lg bg-ink-50 px-3 py-2">
                  <div className="mb-1 flex items-center justify-between text-xs text-ink-500">
                    <span className="font-medium text-ink-700">
                      {getUser(c.contributorId)?.name} · {c.role}
                    </span>
                    <span>{c.timestamp}</span>
                  </div>
                  <div className="text-sm text-ink-800">
                    {Object.entries(c.content).map(([k, v]) => (
                      <div key={k}>
                        <span className="text-ink-500">{k}:</span> {String(v)}
                      </div>
                    ))}
                  </div>
                  {c.evidence && <div className="mt-1 text-xs italic text-ink-400">Evidence: {c.evidence}</div>}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="card sticky top-6 h-fit p-5">
          <h2 className="mb-1 text-sm font-semibold text-ink-900">Admin determination</h2>
          <p className="mb-4 text-xs text-ink-500">
            Internal vocabulary: Advance / Park / Kill. Contributors see these as Advanced / Parked / Not selected.
          </p>

          {!canEvaluate ? (
            <p className="text-sm text-ink-400">Available once input collection is closed.</p>
          ) : (
            <form onSubmit={submitDetermination} className="space-y-4">
              <div className="grid grid-cols-3 gap-2">
                {[
                  { value: 'Advance', label: 'Advance', cls: 'bg-brand-600' },
                  { value: 'Park', label: 'Park', cls: 'bg-amber-500' },
                  { value: 'Kill', label: 'Kill', cls: 'bg-rose-600' },
                ].map((opt) => (
                  <button
                    type="button"
                    key={opt.value}
                    onClick={() => setDecision(opt.value)}
                    className={`rounded-lg px-2 py-2 text-xs font-semibold text-white transition-opacity ${opt.cls} ${
                      decision === opt.value ? 'opacity-100 ring-2 ring-offset-2 ring-ink-900' : 'opacity-60 hover:opacity-90'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>

              <div>
                <label className="label">Supporting rationale (mandatory) *</label>
                <textarea
                  className="textarea"
                  value={rationale}
                  onChange={(e) => setRationale(e.target.value)}
                  placeholder="Record why — this is retained in the Kill-Gate Determination record and never shown to contributors."
                  required
                />
              </div>

              <button type="submit" className="btn-primary w-full" disabled={!decision}>
                Record determination
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}

import React, { useState } from 'react'
import { useParams } from 'react-router-dom'
import { useDemo } from '../data/DemoContext.jsx'
import { getIdeationMission } from '../data/mockData.js'
import { CandidateStatusBadge, Badge } from '../components/StatusBadge.jsx'
import QAThread from '../components/QAThread.jsx'

export default function ScoutMission() {
  const { missionId } = useParams()
  const { candidates, addScoutCandidate, currentUser } = useDemo()
  const mission = getIdeationMission(missionId)

  const [title, setTitle] = useState('')
  const [hypothesis, setHypothesis] = useState('')
  const [evidence, setEvidence] = useState('')
  const [confidence, setConfidence] = useState('Medium')
  const [fileName, setFileName] = useState('')

  const myCandidates = candidates.filter((c) => c.parentMissionId === missionId && c.submittedBy === currentUser.id)

  function handleSubmit(e) {
    e.preventDefault()
    if (!title.trim() || !hypothesis.trim()) return
    addScoutCandidate({ missionId, title: title.trim(), hypothesis: hypothesis.trim(), evidence, confidenceLevel: confidence })
    setTitle('')
    setHypothesis('')
    setEvidence('')
    setFileName('')
  }

  if (!mission) return <div className="card p-6 text-sm text-ink-500">Mission not found.</div>

  return (
    <div className="space-y-6">
      <div>
        <Badge tone="brand">Ideation Mission</Badge>
        <h1 className="mt-2 text-xl font-semibold text-ink-900">{mission.title}</h1>
        <p className="mt-2 max-w-2xl text-sm text-ink-600">{mission.prompt}</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.2fr,1fr]">
        <div className="card p-5">
          <h2 className="mb-1 text-sm font-semibold text-ink-900">Submit a candidate hypothesis</h2>
          <p className="mb-4 text-xs text-ink-500">
            You're not limited to one idea — divergent, independent hypotheses are encouraged. Each submission
            becomes its own Candidate record.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label">Title *</label>
              <input className="input" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Short label for this opportunity" required />
            </div>
            <div>
              <label className="label">Hypothesis / short description *</label>
              <textarea className="textarea" value={hypothesis} onChange={(e) => setHypothesis(e.target.value)} placeholder="What is the candidate idea, and who is it for?" required />
            </div>
            <div>
              <label className="label">Supporting rationale / evidence</label>
              <textarea className="textarea" value={evidence} onChange={(e) => setEvidence(e.target.value)} placeholder="Source links, observed demand signal, rationale…" />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="label">Confidence level</label>
                <select className="input" value={confidence} onChange={(e) => setConfidence(e.target.value)}>
                  <option>Low</option>
                  <option>Medium</option>
                  <option>High</option>
                </select>
              </div>
              <div>
                <label className="label">Evidence document (optional)</label>
                <input
                  type="file"
                  className="input py-1.5"
                  onChange={(e) => setFileName(e.target.files?.[0]?.name || '')}
                />
                {fileName && <div className="mt-1 text-xs text-ink-500">Attached: {fileName}</div>}
              </div>
            </div>
            <button type="submit" className="btn-primary">
              Submit candidate hypothesis
            </button>
          </form>
        </div>

        <div className="space-y-4">
          <div className="card p-5">
            <h2 className="mb-3 text-sm font-semibold text-ink-900">Your submissions on this mission</h2>
            {myCandidates.length === 0 && <p className="text-sm text-ink-500">Nothing submitted yet.</p>}
            <div className="space-y-2">
              {myCandidates.map((c) => (
                <div key={c.id} className="rounded-lg border border-ink-100 p-3">
                  <div className="mb-1 flex items-center justify-between">
                    <span className="text-sm font-medium text-ink-900">{c.title}</span>
                    <CandidateStatusBadge status={c.status} />
                  </div>
                  <p className="line-clamp-2 text-xs text-ink-500">{c.hypothesis}</p>
                </div>
              ))}
            </div>
          </div>

          <QAThread threadKey={missionId} roleScope="Scout" />
        </div>
      </div>
    </div>
  )
}

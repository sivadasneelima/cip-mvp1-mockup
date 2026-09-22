import React, { useState } from 'react'
import { useParams } from 'react-router-dom'
import { useDemo } from '../data/DemoContext.jsx'
import { ROLES } from '../data/mockData.js'
import { CandidateStatusBadge, Badge, MissionStatusBadge } from '../components/StatusBadge.jsx'
import QAThread from '../components/QAThread.jsx'

const RECOMMENDATION_OPTIONS = ['Advance', 'Do not advance (hold)', 'More evidence is required']

function ValidatorForm({ missionId, candidateId, onDone }) {
  const [noise, setNoise] = useState('')
  const [plausibility, setPlausibility] = useState('Plausible')
  const [channel, setChannel] = useState('')
  const [recommendation, setRecommendation] = useState(RECOMMENDATION_OPTIONS[0])
  const [confidence, setConfidence] = useState('Medium')
  const [evidence, setEvidence] = useState('')
  const { addContribution } = useDemo()

  function submit(e) {
    e.preventDefault()
    addContribution({
      missionId,
      candidateId,
      role: ROLES.VALIDATOR,
      content: { noiseOrNiche: noise, plausibilityFlag: plausibility, channelAssessment: channel, recommendation },
      evidence,
      confidenceLevel: confidence,
    })
    onDone()
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      <div>
        <label className="label">Noise / niche call</label>
        <input className="input" value={noise} onChange={(e) => setNoise(e.target.value)} placeholder="e.g., Corroborated niche, not noise" />
      </div>
      <div>
        <label className="label">Plausibility flag</label>
        <select className="input" value={plausibility} onChange={(e) => setPlausibility(e.target.value)}>
          <option>Plausible</option>
          <option>Uncertain</option>
          <option>Implausible</option>
        </select>
      </div>
      <div>
        <label className="label">Channel / route assessment</label>
        <textarea className="textarea" value={channel} onChange={(e) => setChannel(e.target.value)} placeholder="Which go-to-market or regulatory route applies?" />
      </div>
      <div>
        <label className="label">Recommendation *</label>
        <div className="space-y-2">
          {RECOMMENDATION_OPTIONS.map((opt) => (
            <label key={opt} className="flex items-center gap-2 rounded-lg border border-ink-200 px-3 py-2 text-sm has-[:checked]:border-brand-500 has-[:checked]:bg-brand-100">
              <input
                type="radio"
                name="recommendation"
                checked={recommendation === opt}
                onChange={() => setRecommendation(opt)}
              />
              {opt}
            </label>
          ))}
        </div>
        <p className="mt-1 text-xs text-ink-400">Shown exactly as worded here — there is no community-member kill option.</p>
      </div>
      <EvidenceAndConfidence evidence={evidence} setEvidence={setEvidence} confidence={confidence} setConfidence={setConfidence} />
      <button type="submit" className="btn-primary">Submit assessment</button>
    </form>
  )
}

function PredictorForm({ missionId, candidateId, onDone }) {
  const [forecast, setForecast] = useState('Probability this niche converts at ≥20%')
  const [probability, setProbability] = useState(20)
  const [rationale, setRationale] = useState('')
  const [confidence, setConfidence] = useState('Medium')
  const [evidence, setEvidence] = useState('')
  const { addContribution } = useDemo()

  function submit(e) {
    e.preventDefault()
    addContribution({
      missionId,
      candidateId,
      role: ROLES.PREDICTOR,
      content: { forecast, conversionProbability: Number(probability), rationale },
      evidence,
      confidenceLevel: confidence,
    })
    onDone()
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      <div>
        <label className="label">Forecast statement</label>
        <input className="input" value={forecast} onChange={(e) => setForecast(e.target.value)} />
      </div>
      <div>
        <label className="label">Estimated probability (%): {probability}</label>
        <input type="range" min="0" max="100" value={probability} onChange={(e) => setProbability(e.target.value)} className="w-full" />
      </div>
      <div>
        <label className="label">Rationale</label>
        <textarea className="textarea" value={rationale} onChange={(e) => setRationale(e.target.value)} placeholder="What comparable data or model supports this estimate?" />
      </div>
      <EvidenceAndConfidence evidence={evidence} setEvidence={setEvidence} confidence={confidence} setConfidence={setConfidence} />
      <button type="submit" className="btn-primary">Submit forecast</button>
    </form>
  )
}

function DatasetSupplierForm({ missionId, candidateId, onDone }) {
  const [dataType, setDataType] = useState('Search & demand data')
  const [summary, setSummary] = useState('')
  const [confidence, setConfidence] = useState('Medium')
  const [evidence, setEvidence] = useState('')
  const { addContribution } = useDemo()

  function submit(e) {
    e.preventDefault()
    addContribution({
      missionId,
      candidateId,
      role: ROLES.DATASET_SUPPLIER,
      content: { dataType, summary },
      evidence,
      confidenceLevel: confidence,
    })
    onDone()
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      <div>
        <label className="label">Data type</label>
        <select className="input" value={dataType} onChange={(e) => setDataType(e.target.value)}>
          <option>Search &amp; demand data</option>
          <option>Adherence / repeat-use data</option>
          <option>Clinic observations</option>
          <option>Cohort-level patterns</option>
        </select>
      </div>
      <div>
        <label className="label">Summary</label>
        <textarea className="textarea" value={summary} onChange={(e) => setSummary(e.target.value)} placeholder="Describe the dataset and headline findings" />
      </div>
      <EvidenceAndConfidence evidence={evidence} setEvidence={setEvidence} confidence={confidence} setConfidence={setConfidence} isFileFirst />
      <button type="submit" className="btn-primary">Submit dataset</button>
    </form>
  )
}

function EvidenceAndConfidence({ evidence, setEvidence, confidence, setConfidence, isFileFirst }) {
  const [fileName, setFileName] = useState('')
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <div className="sm:col-span-2">
        <label className="label">Evidence — source links / document upload {isFileFirst ? '*' : ''}</label>
        <textarea className="textarea min-h-[64px]" value={evidence} onChange={(e) => setEvidence(e.target.value)} placeholder="Paste source links, or describe the attached file" />
        <input type="file" className="input mt-2 py-1.5" onChange={(e) => setFileName(e.target.files?.[0]?.name || '')} />
        {fileName && <div className="mt-1 text-xs text-ink-500">Attached: {fileName}</div>}
      </div>
      <div>
        <label className="label">Confidence level</label>
        <select className="input" value={confidence} onChange={(e) => setConfidence(e.target.value)}>
          <option>Low</option>
          <option>Medium</option>
          <option>High</option>
        </select>
      </div>
    </div>
  )
}

export default function ValidationSubmission() {
  const { missionId } = useParams()
  const { role, validationMissions, contributions, currentUser, submissionStatus, getCandidate } = useDemo()
  const [justSubmitted, setJustSubmitted] = useState(false)

  const mission = validationMissions.find((m) => m.id === missionId)
  const candidate = mission ? getCandidate(mission.candidateId) : null

  const myContribution = contributions.find(
    (c) => c.missionId === missionId && c.contributorId === currentUser.id,
  )

  if (!mission || !candidate) return <div className="card p-6 text-sm text-ink-500">Mission not found.</div>

  const contributorRole = [ROLES.VALIDATOR, ROLES.PREDICTOR, ROLES.DATASET_SUPPLIER].includes(role)
    ? role
    : ROLES.VALIDATOR

  const alreadySubmitted = Boolean(myContribution) || justSubmitted

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <Badge tone="brand">Validation Mission</Badge>
          <h1 className="mt-2 text-xl font-semibold text-ink-900">{candidate.title}</h1>
          <p className="mt-2 max-w-2xl text-sm text-ink-600">{candidate.hypothesis}</p>
        </div>
        <div className="flex flex-col items-end gap-2">
          <CandidateStatusBadge status={candidate.status} />
          <MissionStatusBadge status={mission.status} />
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.2fr,1fr]">
        <div className="card p-5">
          <h2 className="mb-1 text-sm font-semibold text-ink-900">Your {contributorRole.toLowerCase()} task</h2>
          <p className="mb-4 text-xs text-ink-500">
            Scoped to this Candidate only. Your response is confidential — other contributors on this mission
            never see your evidence, rationale, or recommendation.
          </p>

          {mission.status !== 'Active' ? (
            <div className="rounded-lg bg-ink-100 px-4 py-3 text-sm text-ink-600">
              Input collection for this mission is {mission.status === 'On-Hold' ? 'currently paused (On-Hold)' : 'closed'}.
            </div>
          ) : alreadySubmitted ? (
            <div className="rounded-lg bg-brand-100 px-4 py-3 text-sm text-brand-700">
              Submitted — status: {submissionStatus[myContribution?.id] || 'Submitted'}.{' '}
              {mission.status === 'Active' && 'You may resubmit to update your response while the mission remains Active.'}
            </div>
          ) : contributorRole === ROLES.VALIDATOR ? (
            <ValidatorForm missionId={mission.id} candidateId={candidate.id} onDone={() => setJustSubmitted(true)} />
          ) : contributorRole === ROLES.PREDICTOR ? (
            <PredictorForm missionId={mission.id} candidateId={candidate.id} onDone={() => setJustSubmitted(true)} />
          ) : (
            <DatasetSupplierForm missionId={mission.id} candidateId={candidate.id} onDone={() => setJustSubmitted(true)} />
          )}
        </div>

        <div className="space-y-4">
          <div className="card p-5">
            <h2 className="mb-2 text-sm font-semibold text-ink-900">Candidate evidence on file</h2>
            <p className="text-sm text-ink-600">{candidate.evidence}</p>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {candidate.tags.map((t) => (
                <span key={t} className="rounded-full bg-ink-100 px-2 py-0.5 text-xs text-ink-500">
                  #{t}
                </span>
              ))}
            </div>
          </div>

          <QAThread threadKey={mission.id} roleScope={contributorRole} />
        </div>
      </div>
    </div>
  )
}

import React, { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useDemo } from '../data/DemoContext.jsx'
import { HYPOTHESIS_TYPE_OPTIONS, CONFIDENCE_OPTIONS } from '../data/mockData.js'
import { CountdownCard } from './ScoutMission.jsx'
import { isMissionOpen } from '../lib/deadlines.js'

const TAG_OPTIONS = ['GLP-1', 'Dermatology', 'Healthy ageing', 'Supplements', 'Women 35–55', 'Recovery']
const HYP_MIN_CHARS = 200

export default function ScoutSubmit() {
  const { missionId } = useParams()
  const navigate = useNavigate()
  const { addScoutCandidate, getIdeationMission } = useDemo()
  const mission = getIdeationMission(missionId)

  const [title, setTitle] = useState('')
  const [hypothesisType, setHypothesisType] = useState('')
  const [hypothesis, setHypothesis] = useState('')
  const [rationale, setRationale] = useState('')
  const [links, setLinks] = useState([''])
  const [fileName, setFileName] = useState('')
  const [confidence, setConfidence] = useState('')
  const [tags, setTags] = useState([])
  const [showError, setShowError] = useState(false)

  if (!mission) return <div className="card p-6 text-sm text-ink-500">Mission not found.</div>

  const missionOpen = isMissionOpen(mission)
  const filledLinks = links.filter((l) => l.trim())
  const evidenceCount = filledLinks.length + (fileName ? 1 : 0)
  const hasEvidence = evidenceCount > 0

  function toggleTag(tag) {
    setTags((prev) => (prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]))
  }

  function updateLink(i, value) {
    setLinks((prev) => prev.map((l, idx) => (idx === i ? value : l)))
  }
  function removeLink(i) {
    setLinks((prev) => prev.filter((_, idx) => idx !== i))
  }

  function handleSubmit(e) {
    e.preventDefault()
    if (!hasEvidence) {
      setShowError(true)
      return
    }
    setShowError(false)
    const record = addScoutCandidate({
      missionId,
      title: title.trim(),
      hypothesisType,
      hypothesis: hypothesis.trim(),
      evidence: [...filledLinks, fileName].filter(Boolean).join('; '),
      evidenceLinks: filledLinks,
      evidenceFileName: fileName || null,
      confidenceLevel: confidence || null,
      tags,
    })
    navigate(`/ideation/${missionId}/confirm/${record.id}`)
  }

  return (
    <div className="space-y-6">
      <div className="text-xs text-ink-400">
        <Link to="/" className="hover:underline">Dashboard</Link> <span className="text-ink-300">/</span>{' '}
        <Link to={`/ideation/${missionId}`} className="hover:underline">{mission.id}</Link>{' '}
        <span className="text-ink-300">/</span> New hypothesis
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.3fr,1fr]">
        <div className="card p-6">
          <h1 className="mb-1 text-xl font-semibold text-ink-900">New hypothesis</h1>
          <p className="mb-5 text-sm text-ink-500">
            {missionOpen
              ? `${mission.id} · One evaluable claim per submission. File as many as you have.`
              : `${mission.id} is closed — this is a read-only view of the form.`}
          </p>

          {!missionOpen && (
            <div className="mb-5 rounded-lg bg-ink-100 px-4 py-3 text-sm text-ink-600">
              Submissions closed on {mission.deadline}. You can no longer submit or update a hypothesis on this
              mission — check your dashboard for the outcome once triage completes.
            </div>
          )}

          <p className="mb-5 rounded-lg bg-ink-50 px-3 py-2 text-xs text-ink-500">
            Your identity is never shown alongside this material once it moves into validation — Validators and
            Predictors see the hypothesis and evidence attributed only to &ldquo;Scout&rdquo; (PDD Section 5.5).
          </p>

          {missionOpen && showError && (
            <div className="mb-5 flex gap-3 rounded-lg border border-rose-600 bg-rose-100 px-4 py-3 text-sm">
              <span className="font-bold text-rose-600">!</span>
              <div>
                <div className="font-semibold text-ink-900">This hypothesis cannot be submitted yet</div>
                <div className="text-ink-600">Evidence is required on this mission. Add at least one source link or upload a document.</div>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <fieldset disabled={!missionOpen} className="space-y-5 disabled:opacity-60">
            <div>
              <label className="label">Title *</label>
              <input className="input" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="A short label for this hypothesis" required />
            </div>

            <div>
              <label className="label">Hypothesis type *</label>
              <select className="input" value={hypothesisType} onChange={(e) => setHypothesisType(e.target.value)} required>
                <option value="" disabled>Choose the shape of this hypothesis…</option>
                {HYPOTHESIS_TYPE_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="label">The hypothesis * <span className="font-normal text-ink-400">(200 characters minimum)</span></label>
              <textarea
                className="textarea min-h-[120px]"
                value={hypothesis}
                onChange={(e) => setHypothesis(e.target.value)}
                placeholder="State the need and who has it, as one evaluable claim."
                required
              />
              <div className="mt-1 text-right text-xs text-ink-400">
                {hypothesis.length}/{HYP_MIN_CHARS} min
              </div>
            </div>

            <div>
              <label className="label">Supporting rationale</label>
              <textarea
                className="textarea min-h-[100px]"
                value={rationale}
                onChange={(e) => setRationale(e.target.value)}
                placeholder="Why you believe it — the reasoning a reviewer should be able to judge."
              />
            </div>

            <div>
              <div className="mb-1 flex items-baseline justify-between">
                <label className="label !mb-0">Evidence *</label>
                <span className="text-xs text-ink-400">
                  {evidenceCount === 0 ? 'No evidence attached' : evidenceCount === 1 ? '1 source attached' : `${evidenceCount} sources attached`}
                </span>
              </div>
              <p className="mb-2 text-xs text-ink-500">Source links, uploaded documents, or both.</p>
              <div className="space-y-2">
                {links.map((l, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <input
                      className={`input ${showError && !hasEvidence ? 'border-rose-600' : ''}`}
                      value={l}
                      onChange={(e) => updateLink(i, e.target.value)}
                      placeholder="https://"
                    />
                    {links.length > 1 && (
                      <button type="button" onClick={() => removeLink(i)} className="text-ink-400 hover:text-ink-600">×</button>
                    )}
                  </div>
                ))}
              </div>
              <button type="button" onClick={() => setLinks((prev) => [...prev, ''])} className="mt-2 text-xs font-medium text-brand-600 hover:underline">
                + Add another link
              </button>

              <div className={`mt-3 rounded-lg border border-dashed ${showError && !hasEvidence ? 'border-rose-600' : 'border-ink-300'} p-4 text-center`}>
                <div className="mb-1 text-sm font-medium text-ink-700">
                  Drag documents here, or <label className="cursor-pointer text-brand-600">browse
                    <input type="file" className="hidden" onChange={(e) => setFileName(e.target.files?.[0]?.name || '')} />
                  </label>
                </div>
                <div className="text-xs text-ink-400">PDF, DOCX, XLSX, CSV, PNG, JPG · up to 25 MB per file</div>
              </div>
              {fileName && (
                <div className="mt-2 flex items-center gap-2 rounded-lg border border-ink-100 px-3 py-2 text-sm">
                  <span>📄</span>
                  <span className="flex-1 truncate text-ink-700">{fileName}</span>
                  <button type="button" onClick={() => setFileName('')} className="text-ink-400 hover:text-ink-600">×</button>
                </div>
              )}
            </div>

            <div>
              <label className="label">How confident are you in this hypothesis?</label>
              <div className="space-y-2">
                {CONFIDENCE_OPTIONS.map((opt) => (
                  <label key={opt.value} className="flex items-center gap-2 rounded-lg border border-ink-200 px-3 py-2 text-sm has-[:checked]:border-brand-500 has-[:checked]:bg-brand-100">
                    <input type="radio" name="confidence" checked={confidence === opt.value} onChange={() => setConfidence(opt.value)} />
                    {opt.label}
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="label">Tags</label>
              <div className="flex flex-wrap gap-2">
                {TAG_OPTIONS.map((tag) => (
                  <button
                    type="button"
                    key={tag}
                    onClick={() => toggleTag(tag)}
                    className={`rounded-full border px-3 py-1 text-xs font-medium ${
                      tags.includes(tag) ? 'border-brand-500 bg-brand-500 text-white' : 'border-ink-200 bg-white text-ink-600'
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
            </fieldset>

            <div className="flex flex-wrap items-center gap-3">
              {missionOpen ? (
                <>
                  <button type="submit" className="btn-primary">Submit hypothesis</button>
                  <span className="text-xs text-ink-500">You can update this submission while the mission is open.</span>
                </>
              ) : (
                <span className="text-xs font-medium text-ink-500">Submissions have closed for this mission.</span>
              )}
              <Link to={`/ideation/${missionId}`} className="btn-secondary">
                {missionOpen ? 'Cancel' : 'Back to mission'}
              </Link>
            </div>
          </form>
        </div>

        <div className="space-y-4">
          <div className="card p-5">
            <CountdownCard mission={mission} />
          </div>
          <div className="card p-5">
            <h2 className="mb-3 text-sm font-semibold text-ink-900">Required on this mission</h2>
            <ul className="space-y-2 text-sm text-ink-600">
              <li><span className="mr-1 font-bold text-brand-600">*</span>Title</li>
              <li><span className="mr-1 font-bold text-brand-600">*</span>Hypothesis type</li>
              <li><span className="mr-1 font-bold text-brand-600">*</span>The hypothesis — 200 characters minimum</li>
              <li><span className="mr-1 font-bold text-brand-600">*</span>Evidence — at least one source</li>
              <li className="text-ink-400"><span className="mr-1 font-bold">○</span>Supporting rationale, confidence, and tags are optional</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

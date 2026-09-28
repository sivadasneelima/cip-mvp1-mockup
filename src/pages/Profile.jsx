import React, { useState } from 'react'
import { useDemo } from '../data/DemoContext.jsx'
import { COUNTRY_OPTIONS, EXPERTISE_TAG_OPTIONS } from '../data/mockData.js'

// Registration / profile screen — the mockup's realization of the PDD 5.7
// Contributor record. Reachable by any contributor role and the Community
// Ambassador; a BioV Admin doesn't hold one (there's no invitation flow
// bringing an Admin in as a community member in the first place).
function completeness(user) {
  let pct = 40
  pct += Math.min(30, (user.expertiseTags || []).length * 8)
  pct += user.bio ? 15 : 0
  pct += user.linkedIn ? 8 : 0
  pct += user.resumeFileName ? 7 : 0
  return Math.min(100, pct)
}

export default function Profile() {
  const { currentUser, updateProfile } = useDemo()
  const [name, setName] = useState(currentUser.name)
  const [country, setCountry] = useState(currentUser.country)
  const [stateRegion, setStateRegion] = useState(currentUser.stateRegion || '')
  const [bio, setBio] = useState(currentUser.bio || '')
  const [linkedIn, setLinkedIn] = useState(currentUser.linkedIn || '')
  const [resumeFileName, setResumeFileName] = useState(currentUser.resumeFileName || '')
  const [tags, setTags] = useState(currentUser.expertiseTags || [])
  const [saved, setSaved] = useState(false)

  const draftUser = { ...currentUser, expertiseTags: tags, bio, linkedIn, resumeFileName }
  const pct = completeness(draftUser)

  function toggleTag(tag) {
    setTags((prev) => (prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]))
  }

  function handleSave(e) {
    e.preventDefault()
    updateProfile({ name, country, stateRegion, bio, linkedIn, resumeFileName, expertiseTags: tags })
    setSaved(true)
    window.setTimeout(() => setSaved(false), 2500)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-ink-900">Your profile</h1>
        <p className="mt-1 max-w-xl text-sm text-ink-600">
          Given once, used across every mission you are invited to. Fields marked <span className="font-semibold text-brand-600">*</span> are required.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.3fr,1fr]">
        <form onSubmit={handleSave} className="card space-y-5 p-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="label">Full name *</label>
              <input className="input" value={name} onChange={(e) => setName(e.target.value)} required />
            </div>
            <div>
              <label className="label">Email</label>
              <input className="input bg-ink-50" value={currentUser.email} disabled />
            </div>
            <div>
              <label className="label">Country *</label>
              <select className="input" value={country} onChange={(e) => setCountry(e.target.value)} required>
                {COUNTRY_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="label">State / region</label>
              <input className="input" value={stateRegion} onChange={(e) => setStateRegion(e.target.value)} placeholder="Massachusetts" />
            </div>
          </div>

          <div>
            <label className="label">Short bio</label>
            <textarea className="textarea" value={bio} onChange={(e) => setBio(e.target.value)} placeholder="What you work on, and the populations or categories you know well." />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="label">LinkedIn profile</label>
              <input className="input" value={linkedIn} onChange={(e) => setLinkedIn(e.target.value)} placeholder="linkedin.com/in/…" />
            </div>
            <div>
              <label className="label">Resume or CV</label>
              <div className="flex items-center gap-2 rounded-lg border border-dashed border-ink-300 px-3 py-2">
                <span className="text-brand-600">⬆</span>
                <label className="flex-1 cursor-pointer text-xs text-ink-500">
                  {resumeFileName || 'PDF or DOCX, up to 25 MB'}
                  <input type="file" className="hidden" onChange={(e) => setResumeFileName(e.target.files?.[0]?.name || resumeFileName)} />
                </label>
              </div>
            </div>
          </div>

          <div>
            <label className="label">Areas of expertise *</label>
            <p className="mb-2 text-xs text-ink-500">Used to match you to missions and Candidates. Pick as many as apply.</p>
            <div className="flex flex-wrap gap-2">
              {EXPERTISE_TAG_OPTIONS.map((tag) => (
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

          <div className="flex items-center gap-3">
            <button type="submit" className="btn-primary">Save profile</button>
            {saved && <span className="text-xs font-medium text-brand-600">Saved.</span>}
          </div>
        </form>

        <div className="space-y-4">
          <div className="card p-5">
            <h2 className="mb-2 text-sm font-semibold text-ink-900">Profile completeness</h2>
            <div className="h-2.5 w-full overflow-hidden rounded-full bg-ink-100">
              <div className="h-full rounded-full bg-brand-500" style={{ width: `${pct}%` }} />
            </div>
            <div className="mt-2 text-xs text-ink-600">{pct}% complete · bio and resume still optional</div>
            <p className="mt-3 text-xs text-ink-500">A fuller profile gives the team more to go on when choosing who to invite to a mission.</p>
          </div>
          <div className="card p-5">
            <h2 className="mb-2 text-sm font-semibold text-ink-900">Your data</h2>
            <p className="text-xs leading-relaxed text-ink-500">
              Your CV, biography and contact details are encrypted at rest and in transit, and are visible only to
              the BioV team and your assigned Community Ambassador. You can request removal of your registration
              data at any time.
            </p>
          </div>
          <div className="card p-5">
            <h2 className="mb-2 text-sm font-semibold text-ink-900">Account status</h2>
            <div className="text-sm text-ink-700">{currentUser.administrativeStatus}</div>
            <div className="mt-1 text-xs text-ink-400">Registered {currentUser.registeredOn || '—'} · Last active {currentUser.lastActive || '—'}</div>
          </div>
        </div>
      </div>
    </div>
  )
}

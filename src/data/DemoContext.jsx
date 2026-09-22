import React, { createContext, useContext, useMemo, useState } from 'react'
import {
  ROLES,
  users,
  CURRENT_USER_BY_ROLE,
  ideationMissions as seedIdeationMissions,
  candidates as seedCandidates,
  validationMissions as seedValidationMissions,
  contributions as seedContributions,
  qaThreads as seedQaThreads,
  submissionStatusForMember as seedSubmissionStatus,
} from './mockData.js'

const DemoContext = createContext(null)

let idCounter = 9000
function nextId(prefix) {
  idCounter += 1
  return `${prefix}-${idCounter}`
}

export function DemoProvider({ children }) {
  const [role, setRole] = useState(ROLES.SCOUT)
  const [ideationMissions] = useState(seedIdeationMissions)
  const [candidates, setCandidates] = useState(seedCandidates)
  const [validationMissions, setValidationMissions] = useState(seedValidationMissions)
  const [contributions, setContributions] = useState(seedContributions)
  const [determinations, setDeterminations] = useState([])
  const [qaThreads, setQaThreads] = useState(seedQaThreads)
  const [submissionStatus, setSubmissionStatus] = useState(seedSubmissionStatus)
  const [toast, setToast] = useState(null)

  const currentUser = CURRENT_USER_BY_ROLE[role]

  function notify(message) {
    setToast(message)
    window.clearTimeout(notify._t)
    notify._t = window.setTimeout(() => setToast(null), 3200)
  }

  function addScoutCandidate({ missionId, title, hypothesis, evidence, confidenceLevel }) {
    const id = nextId('C')
    const record = {
      id,
      parentMissionId: missionId,
      validationMissionId: null,
      title,
      hypothesis,
      submittedBy: currentUser.id,
      sourceType: 'Scout-generated',
      tags: [],
      evidence,
      confidenceLevel,
      status: 'Proposed',
      statusReasonCode: null,
      createdDate: new Date().toISOString().slice(0, 10),
    }
    setCandidates((prev) => [...prev, record])
    notify(`Candidate "${title}" submitted for Admin triage.`)
    return record
  }

  function addContribution({ missionId, candidateId, role: contribRole, content, evidence, confidenceLevel }) {
    const id = nextId('CT')
    const record = {
      id,
      contributorId: currentUser.id,
      role: contribRole,
      missionId,
      candidateId,
      content,
      evidence,
      confidenceLevel,
      status: 'Active',
      timestamp: new Date().toISOString().slice(0, 10),
    }
    setContributions((prev) => [...prev, record])
    setSubmissionStatus((prev) => ({ ...prev, [id]: 'Submitted' }))
    notify('Submission recorded.')
    return record
  }

  function triageShortlist(candidateId) {
    setCandidates((prev) =>
      prev.map((c) => (c.id === candidateId ? { ...c, status: 'Shortlisted' } : c)),
    )
    notify('Candidate shortlisted. Create a Validation Mission to activate it.')
  }

  function triageSuspend(candidateId) {
    setCandidates((prev) =>
      prev.map((c) =>
        c.id === candidateId ? { ...c, status: 'Suspended', statusReasonCode: 'not-shortlisted' } : c,
      ),
    )
    notify('Candidate moved to Suspended (not shortlisted).')
  }

  function createValidationMission(candidateId, gates) {
    const vmId = nextId('VM')
    setValidationMissions((prev) => [
      ...prev,
      {
        id: vmId,
        candidateId,
        title: `Validation Mission for ${candidateId}`,
        status: 'Active',
        contributors: [],
        killGates: gates && gates.length ? gates : [
          {
            id: nextId('G'),
            label: 'Validator advance consensus',
            type: 'quantitative',
            boundField: 'recommendation',
            threshold: '≥ 60% of Active Validator recommendations = Advance',
          },
        ],
      },
    ])
    setCandidates((prev) =>
      prev.map((c) => (c.id === candidateId ? { ...c, validationMissionId: vmId, status: 'Active' } : c)),
    )
    notify('Validation Mission created and Candidate is now Active.')
    return vmId
  }

  function closeInputAndEvaluate(missionId, candidateId) {
    setValidationMissions((prev) => prev.map((m) => (m.id === missionId ? { ...m, status: 'Closed' } : m)))
    setCandidates((prev) => prev.map((c) => (c.id === candidateId ? { ...c, status: 'Gated' } : c)))
    notify('Input collection closed. Candidate moved to Under Review.')
  }

  function recordDetermination({ candidateId, missionId, gateSnapshot, tallySnapshot, determination, rationale }) {
    const record = {
      id: nextId('KGD'),
      candidateId,
      missionId,
      determination, // Advance / Park / Kill
      rationale,
      criteriaSnapshot: gateSnapshot,
      tallySnapshot,
      actor: currentUser.name,
      timestamp: new Date().toISOString().slice(0, 16).replace('T', ' '),
    }
    setDeterminations((prev) => [...prev, record])

    setCandidates((prev) =>
      prev.map((c) => {
        if (c.id !== candidateId) return c
        if (determination === 'Advance') return { ...c, status: 'InValidation' }
        if (determination === 'Park') return { ...c, status: 'Suspended', statusReasonCode: 'parked-at-gate' }
        return { ...c, status: 'Suspended', statusReasonCode: 'killed-at-gate' }
      }),
    )
    setValidationMissions((prev) =>
      prev.map((m) => (m.id === missionId ? { ...m, status: 'Closed' } : m)),
    )
    notify(`Determination recorded: ${determination}.`)
    return record
  }

  function placeOnHold(missionId) {
    setValidationMissions((prev) => prev.map((m) => (m.id === missionId ? { ...m, status: 'On-Hold' } : m)))
    notify('Validation Mission placed On-Hold.')
  }

  function resumeMission(missionId) {
    setValidationMissions((prev) => prev.map((m) => (m.id === missionId ? { ...m, status: 'Active' } : m)))
    notify('Validation Mission resumed.')
  }

  function addQaPost(threadKey, roleScope, body) {
    setQaThreads((prev) => {
      const existing = prev[threadKey] ? [...prev[threadKey]] : []
      const idx = existing.findIndex((t) => t.role === roleScope)
      const newPost = {
        id: nextId('Q'),
        author: currentUser.name,
        authorRole: role,
        body,
        timestamp: new Date().toISOString().slice(0, 16).replace('T', ' '),
      }
      if (idx >= 0) {
        existing[idx] = { ...existing[idx], posts: [...existing[idx].posts, newPost] }
      } else {
        existing.push({ role: roleScope, posts: [newPost] })
      }
      return { ...prev, [threadKey]: existing }
    })
    notify('Question posted.')
  }

  // Live lookups — deliberately shadowing the mockData.js helpers of the same
  // name, which only ever search the original hardcoded seed arrays. Any
  // record created at runtime (a Scout's Candidate, an Admin-created
  // Validation Mission) only exists in this context's state, so every screen
  // must resolve single records through these, not through mockData.js
  // directly, or lookups for newly created records silently fail.
  function getCandidate(id) {
    return candidates.find((c) => c.id === id)
  }
  function getValidationMission(id) {
    return validationMissions.find((m) => m.id === id)
  }
  function getIdeationMission(id) {
    return ideationMissions.find((m) => m.id === id)
  }

  const value = useMemo(
    () => ({
      role,
      setRole,
      currentUser,
      users,
      ideationMissions,
      getCandidate,
      getValidationMission,
      getIdeationMission,
      candidates,
      validationMissions,
      contributions,
      determinations,
      qaThreads,
      submissionStatus,
      toast,
      addScoutCandidate,
      addContribution,
      triageShortlist,
      triageSuspend,
      createValidationMission,
      closeInputAndEvaluate,
      recordDetermination,
      placeOnHold,
      resumeMission,
      addQaPost,
    }),
    [role, currentUser, candidates, validationMissions, contributions, determinations, qaThreads, submissionStatus, toast, ideationMissions],
  )

  return <DemoContext.Provider value={value}>{children}</DemoContext.Provider>
}

export function useDemo() {
  const ctx = useContext(DemoContext)
  if (!ctx) throw new Error('useDemo must be used within DemoProvider')
  return ctx
}

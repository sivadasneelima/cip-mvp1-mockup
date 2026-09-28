import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'
import {
  users as seedUsers,
  ideationMissions as seedIdeationMissions,
  candidates as seedCandidates,
  validationMissions as seedValidationMissions,
  contributions as seedContributions,
  qaThreads as seedQaThreads,
  submissionStatusForMember as seedSubmissionStatus,
} from './mockData.js'

const DemoContext = createContext(null)
const SESSION_KEY = 'cip_current_user_id'

let idCounter = 9000
function nextId(prefix) {
  idCounter += 1
  return `${prefix}-${idCounter}`
}

function readStoredUserId() {
  try {
    return window.localStorage.getItem(SESSION_KEY)
  } catch {
    return null
  }
}

export function DemoProvider({ children }) {
  const [currentUserId, setCurrentUserId] = useState(readStoredUserId)
  // Seeded synchronously from the same persisted id so a return visit (page
  // reload with a session already stored) never renders one frame with a
  // resolved `currentUser` but a still-null `role` — the effect below only
  // has to handle role changing after the fact, not priming it on mount.
  const [role, setRoleState] = useState(() => {
    const uid = readStoredUserId()
    const seeded = seedUsers.find((u) => u.id === uid)
    return seeded ? seeded.roles[0] : null
  })
  const [users, setUsers] = useState(seedUsers)
  const [ideationMissions] = useState(seedIdeationMissions)
  const [candidates, setCandidates] = useState(seedCandidates)
  const [validationMissions, setValidationMissions] = useState(seedValidationMissions)
  const [contributions, setContributions] = useState(seedContributions)
  const [determinations, setDeterminations] = useState([])
  const [qaThreads, setQaThreads] = useState(seedQaThreads)
  const [submissionStatus, setSubmissionStatus] = useState(seedSubmissionStatus)
  const [toast, setToast] = useState(null)

  // A real login, not a role preview: `currentUserId` is set only by `login`
  // (PDD magic-link sign-in, stood in for here by an email lookup) and is
  // resolved against live `users` state every render, same lookup pattern as
  // every other record in this context. No entry in `users` is ever assumed
  // to be "the" Scout/Validator/etc. any more — whoever logs in is whoever is
  // currently acting, which is what makes the deactivation lock-out below
  // possible to demo at all.
  const currentUser = users.find((u) => u.id === currentUserId) || null

  function notify(message) {
    setToast(message)
    window.clearTimeout(notify._t)
    notify._t = window.setTimeout(() => setToast(null), 3200)
  }

  function logout() {
    setCurrentUserId(null)
    setRoleState(null)
    try {
      window.localStorage.removeItem(SESSION_KEY)
    } catch {
      /* ignore — demo still works without persisted sessions */
    }
  }

  // PDD 4.8 sign-in: in production a one-time magic link; here, looking the
  // contributor up by the email their invite went to. Returns a status the
  // Login screen renders copy for, rather than throwing, since "no account"
  // and "deactivated" are both expected, demo-able outcomes, not errors.
  function login(email) {
    const trimmed = (email || '').trim().toLowerCase()
    const match = users.find((u) => u.email.toLowerCase() === trimmed)
    if (!match) return { status: 'not-found' }
    if (match.administrativeStatus === 'Deactivated') return { status: 'deactivated', user: match }
    setCurrentUserId(match.id)
    setRoleState(match.roles[0])
    try {
      window.localStorage.setItem(SESSION_KEY, match.id)
    } catch {
      /* ignore — demo still works without persisted sessions */
    }
    setUsers((prev) =>
      prev.map((u) => (u.id === match.id ? { ...u, lastActive: new Date().toISOString().slice(0, 10) } : u)),
    )
    return { status: 'ok', user: match }
  }

  // A person who holds more than one role (e.g. a Validator who is also a
  // Predictor) switches which hat they're wearing here — restricted to their
  // own roles, unlike the old demo-only "preview as any role" switch.
  function setActingRole(nextRole) {
    if (!currentUser || !currentUser.roles.includes(nextRole)) return
    setRoleState(nextRole)
  }

  // Keeps `role` valid whenever the logged-in identity changes, and signs a
  // contributor out the moment their own record goes Deactivated — including
  // an Admin deactivating the very person currently sitting in that seat
  // during this same demo session (UN-ORG-12 / UN-GEN-18 in action, not just
  // described in the Contributors screen).
  useEffect(() => {
    if (!currentUser) {
      if (role !== null) setRoleState(null)
      return
    }
    if (currentUser.administrativeStatus === 'Deactivated') {
      notify(`${currentUser.name}'s access was deactivated — signed out.`)
      logout()
      return
    }
    if (!role || !currentUser.roles.includes(role)) {
      setRoleState(currentUser.roles[0])
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser, role])

  function addScoutCandidate({ missionId, title, hypothesis, hypothesisType, evidence, evidenceLinks, evidenceFileName, confidenceLevel, tags }) {
    const id = nextId('C')
    const record = {
      id,
      parentMissionId: missionId,
      validationMissionId: null,
      title,
      hypothesis,
      hypothesisType: hypothesisType || null,
      submittedBy: currentUser.id,
      sourceType: 'Scout-generated',
      tags: tags || [],
      evidence,
      evidenceLinks: evidenceLinks || [],
      evidenceFileName: evidenceFileName || null,
      confidenceLevel,
      status: 'Proposed',
      statusReasonCode: null,
      createdDate: new Date().toISOString().slice(0, 10),
    }
    setCandidates((prev) => [...prev, record])
    notify(`Candidate "${title}" submitted for Admin triage.`)
    return record
  }

  // Profile screen (PDD 5.7 Contributor record) — merges edits into the
  // current user's own record. Completing the form for the first time also
  // moves an Invited contributor to Active, standing in for "registration".
  function updateProfile(updates) {
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id !== currentUser.id) return u
        const next = { ...u, ...updates }
        if (u.administrativeStatus === 'Invited') {
          next.administrativeStatus = 'Active'
          next.registeredOn = new Date().toISOString().slice(0, 10)
        }
        return next
      }),
    )
    notify('Profile saved.')
  }

  // Admin action (PDD 4.8 user management / Section 5.7 Deactivated status).
  // `notify` here means "send the contributor an email" — a checkbox on the
  // Admin screen, tracked only as a flag on the toast copy: PDD v1.5 has no
  // such notification, and the User Needs Register (UN-GEN-18) flags that
  // gap rather than resolving it, so this mockup surfaces the choice without
  // pretending the underlying email exists.
  function deactivateContributor(userId, shouldNotify) {
    setUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, administrativeStatus: 'Deactivated' } : u)))
    const person = users.find((u) => u.id === userId)
    notify(
      shouldNotify
        ? `${person?.name || 'Contributor'} deactivated — notification email queued.`
        : `${person?.name || 'Contributor'} deactivated — no notification sent (UNR UN-GEN-18: known gap).`,
    )
  }

  // Reversing a deactivation (PDD 4.8 / UN-ORG-12: withdrawing access must not
  // cost the contributor their history) — every Candidate and Contribution
  // record they authored stays exactly as it was; only administrativeStatus
  // changes, same as deactivation itself only ever touches that one field.
  function reactivateContributor(userId) {
    setUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, administrativeStatus: 'Active' } : u)))
    const person = users.find((u) => u.id === userId)
    notify(`${person?.name || 'Contributor'} reactivated — full access restored.`)
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
  function getUser(id) {
    return users.find((u) => u.id === id)
  }

  const value = useMemo(
    () => ({
      role,
      setRole: setActingRole,
      currentUser,
      login,
      logout,
      users,
      getUser,
      updateProfile,
      deactivateContributor,
      reactivateContributor,
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
    [role, currentUser, users, candidates, validationMissions, contributions, determinations, qaThreads, submissionStatus, toast, ideationMissions],
  )

  return <DemoContext.Provider value={value}>{children}</DemoContext.Provider>
}

export function useDemo() {
  const ctx = useContext(DemoContext)
  if (!ctx) throw new Error('useDemo must be used within DemoProvider')
  return ctx
}

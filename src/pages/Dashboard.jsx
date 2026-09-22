import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useDemo } from '../data/DemoContext.jsx'
import { ROLES, getCandidate, getIdeationMission, getValidationMission } from '../data/mockData.js'
import { CandidateStatusBadge, Badge } from '../components/StatusBadge.jsx'

function BlockedRoleNotice() {
  const location = useLocation()
  const blockedRole = location.state?.blockedRole
  if (!blockedRole) return null
  return (
    <div className="rounded-lg border border-amber-500/40 bg-amber-100 px-4 py-3 text-sm text-amber-600">
      That screen isn't available to the <strong>{blockedRole}</strong> role — access is scoped per role, the same
      way the real platform enforces it server-side (PDD Section 7.1). You've been brought back to your dashboard.
    </div>
  )
}

function ContributorDashboard() {
  const { role, currentUser, candidates, validationMissions, contributions, submissionStatus, ideationMissions } =
    useDemo()

  const myContributions = contributions.filter((c) => c.contributorId === currentUser.id || c.role === role)

  const pending = []
  const completed = []

  if (role === ROLES.SCOUT) {
    ideationMissions
      .filter((m) => m.status === 'Active' || m.status === 'Triaging')
      .forEach((m) => pending.push({ kind: 'ideation', mission: m }))
  } else {
    validationMissions
      .filter((vm) => vm.status === 'Active')
      .forEach((vm) => {
        const candidate = getCandidate(vm.candidateId)
        const mine = myContributions.find((c) => c.missionId === vm.id)
        if (!mine) pending.push({ kind: 'validation', mission: vm, candidate })
      })
  }

  myContributions.forEach((c) => {
    const candidate = getCandidate(c.candidateId)
    const mission = getValidationMission(c.missionId) || getIdeationMission(c.missionId)
    completed.push({ contribution: c, candidate, mission })
  })

  return (
    <div className="space-y-6">
      <div className="card p-5">
        <h2 className="text-base font-semibold text-ink-900">Welcome back, {currentUser.name.split(' ')[0]}</h2>
        <p className="mt-1 max-w-2xl text-sm text-ink-600">
          The Community Intelligence Platform captures early signal on new consumer-health product opportunities
          from a small, credentialed community of experts. Depending on your role, you'll be asked to surface
          candidate ideas (Ideation Missions) or assess a shortlisted opportunity's viability (Validation
          Missions). Your identity and detailed judgements are never shown to other contributors.
        </p>
      </div>

      <div>
        <h3 className="section-title mb-2">Pending / in-progress — {role}</h3>
        {pending.length === 0 && (
          <div className="card p-5 text-sm text-ink-500">Nothing waiting on you right now.</div>
        )}
        <div className="grid gap-3 sm:grid-cols-2">
          {pending.map((item, i) =>
            item.kind === 'ideation' ? (
              <Link
                key={i}
                to={`/ideation/${item.mission.id}`}
                className="card p-4 transition hover:border-brand-400 hover:shadow-md"
              >
                <div className="mb-1 flex items-center justify-between">
                  <Badge tone="brand">Ideation Mission</Badge>
                  <span className="text-xs text-ink-400">{item.mission.status}</span>
                </div>
                <div className="text-sm font-medium text-ink-900">{item.mission.title}</div>
                <p className="mt-1 line-clamp-2 text-xs text-ink-500">{item.mission.prompt}</p>
              </Link>
            ) : (
              <Link
                key={i}
                to={`/validation/${item.mission.id}`}
                className="card p-4 transition hover:border-brand-400 hover:shadow-md"
              >
                <div className="mb-1 flex items-center justify-between">
                  <Badge tone="brand">Validation Mission</Badge>
                  <CandidateStatusBadge status={item.candidate?.status} />
                </div>
                <div className="text-sm font-medium text-ink-900">{item.candidate?.title}</div>
                <p className="mt-1 line-clamp-2 text-xs text-ink-500">{item.candidate?.hypothesis}</p>
              </Link>
            ),
          )}
        </div>
      </div>

      <div>
        <h3 className="section-title mb-2">Completed submissions</h3>
        {completed.length === 0 && (
          <div className="card p-5 text-sm text-ink-500">You haven't submitted anything yet.</div>
        )}
        <div className="card divide-y divide-ink-100">
          {completed.map((item) => (
            <div key={item.contribution.id} className="flex items-center justify-between px-4 py-3">
              <div className="min-w-0">
                <div className="truncate text-sm font-medium text-ink-900">
                  {item.candidate?.title || item.mission?.title}
                </div>
                <div className="text-xs text-ink-400">Submitted {item.contribution.timestamp}</div>
              </div>
              <Badge tone={submissionStatus[item.contribution.id] === 'Advanced' ? 'brand' : 'ink'}>
                {submissionStatus[item.contribution.id] || 'Submitted'}
              </Badge>
            </div>
          ))}
        </div>
        <p className="mt-2 text-xs text-ink-400">
          This shows the disposition of your own contribution only — never the underlying observed outcomes used
          for reputation scoring.
        </p>
      </div>
    </div>
  )
}

function CADashboard() {
  const { validationMissions, ideationMissions } = useDemo()
  return (
    <div className="space-y-6">
      <div className="card p-5">
        <h2 className="text-base font-semibold text-ink-900">Community Ambassador overview</h2>
        <p className="mt-1 text-sm text-ink-600">
          Recruit and invite members, track submission status, send reminders, and answer clarifying questions
          for the missions you're assigned to.
        </p>
      </div>
      <div className="grid gap-3 sm:grid-cols-3">
        <div className="card p-4">
          <div className="text-2xl font-semibold text-ink-900">{ideationMissions.length}</div>
          <div className="text-xs text-ink-500">Ideation missions</div>
        </div>
        <div className="card p-4">
          <div className="text-2xl font-semibold text-ink-900">{validationMissions.length}</div>
          <div className="text-xs text-ink-500">Validation missions</div>
        </div>
        <div className="card p-4">
          <div className="text-2xl font-semibold text-ink-900">
            {validationMissions.filter((m) => m.status === 'Active').length}
          </div>
          <div className="text-xs text-ink-500">Currently collecting input</div>
        </div>
      </div>
      <Link to="/ca" className="btn-primary w-fit">
        Open community console →
      </Link>
    </div>
  )
}

function AdminDashboard() {
  const { candidates, validationMissions } = useDemo()
  const gated = candidates.filter((c) => c.status === 'Gated')
  return (
    <div className="space-y-6">
      <div className="card p-5">
        <h2 className="text-base font-semibold text-ink-900">BioV Admin overview</h2>
        <p className="mt-1 text-sm text-ink-600">
          Define missions, triage the Candidate pool, and make advance / park / kill determinations at each
          kill-gate. MVP 1 shows response tallies only — every determination is yours.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <div className="card p-4">
          <div className="text-2xl font-semibold text-ink-900">{candidates.length}</div>
          <div className="text-xs text-ink-500">Total candidates</div>
        </div>
        <div className="card p-4">
          <div className="text-2xl font-semibold text-ink-900">{validationMissions.length}</div>
          <div className="text-xs text-ink-500">Validation missions</div>
        </div>
        <div className="card p-4">
          <div className="text-2xl font-semibold text-amber-600">{gated.length}</div>
          <div className="text-xs text-ink-500">Awaiting kill-gate determination</div>
        </div>
      </div>

      {gated.length > 0 && (
        <div>
          <h3 className="section-title mb-2">Awaiting your determination</h3>
          <div className="grid gap-3 sm:grid-cols-2">
            {gated.map((c) => (
              <Link key={c.id} to={`/admin/gate/${c.id}`} className="card p-4 hover:border-amber-400 hover:shadow-md">
                <div className="mb-1 flex items-center justify-between">
                  <CandidateStatusBadge status={c.status} />
                  <span className="text-xs text-ink-400">{c.id}</span>
                </div>
                <div className="text-sm font-medium text-ink-900">{c.title}</div>
              </Link>
            ))}
          </div>
        </div>
      )}

      <div className="flex gap-3">
        <Link to="/admin/missions" className="btn-secondary">
          Missions &amp; candidates
        </Link>
        <Link to="/admin/triage/IM-1" className="btn-secondary">
          Ideation triage
        </Link>
      </div>
    </div>
  )
}

export default function Dashboard() {
  const { role } = useDemo()
  return (
    <div className="space-y-4">
      <BlockedRoleNotice />
      {role === ROLES.CA ? <CADashboard /> : role === ROLES.ADMIN ? <AdminDashboard /> : <ContributorDashboard />}
    </div>
  )
}

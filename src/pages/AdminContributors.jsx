import React, { useMemo, useState } from 'react'
import { useDemo } from '../data/DemoContext.jsx'
import { Badge } from '../components/StatusBadge.jsx'
import { ROLES } from '../data/mockData.js'

// Admin contributor management (PDD 4.8 / Section 5.7 Contributor record).
// A BioV Admin doesn't manage their own account here — this screen lists
// everyone else: Scouts, Validators, Predictors, Dataset Suppliers, and the
// Community Ambassador.
const MANAGEABLE_ROLES = [ROLES.SCOUT, ROLES.VALIDATOR, ROLES.PREDICTOR, ROLES.DATASET_SUPPLIER, ROLES.CA]

const STATUS_TONE = {
  Invited: 'ink',
  Registered: 'ink',
  Active: 'brand',
  Inactive: 'amber',
  Deactivated: 'rose',
}

const ALL_STATUSES = ['All', 'Invited', 'Registered', 'Active', 'Inactive', 'Deactivated']

export default function AdminContributors() {
  const { users, candidates, contributions, deactivateContributor, reactivateContributor } = useDemo()

  const contributors = useMemo(
    () => users.filter((u) => u.roles.some((r) => MANAGEABLE_ROLES.includes(r))),
    [users],
  )

  const [roleFilter, setRoleFilter] = useState('All')
  const [statusFilter, setStatusFilter] = useState('All')
  const [selectedId, setSelectedId] = useState(contributors[0]?.id || null)
  const [notifyOnDeactivate, setNotifyOnDeactivate] = useState(true)
  const [confirmingDeactivate, setConfirmingDeactivate] = useState(false)

  const filtered = contributors.filter((u) => {
    if (roleFilter !== 'All' && !u.roles.includes(roleFilter)) return false
    if (statusFilter !== 'All' && u.administrativeStatus !== statusFilter) return false
    return true
  })

  const selected = contributors.find((u) => u.id === selectedId) || filtered[0] || null

  function selectUser(id) {
    setSelectedId(id)
    setConfirmingDeactivate(false)
    setNotifyOnDeactivate(true)
  }

  function handleDeactivate() {
    if (!selected) return
    deactivateContributor(selected.id, notifyOnDeactivate)
    setConfirmingDeactivate(false)
  }

  const theirCandidates = selected ? candidates.filter((c) => c.submittedBy === selected.id) : []
  const theirContributions = selected ? contributions.filter((c) => c.contributorId === selected.id) : []

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-ink-900">Contributors</h1>
        <p className="mt-1 max-w-2xl text-sm text-ink-600">
          View every registered contributor's status, and deactivate or reactivate access. Deactivating never removes
          a contributor's past Candidates or submissions — those stay exactly as recorded.
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        <select className="input w-auto text-sm" value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)}>
          <option value="All">All roles</option>
          {MANAGEABLE_ROLES.map((r) => (
            <option key={r} value={r}>{r}</option>
          ))}
        </select>
        <select className="input w-auto text-sm" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          {ALL_STATUSES.map((s) => (
            <option key={s} value={s}>{s === 'All' ? 'All statuses' : s}</option>
          ))}
        </select>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.3fr,1fr]">
        <div className="card overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-ink-100 text-xs uppercase tracking-wide text-ink-400">
                <th className="px-4 py-2 font-medium">Contributor</th>
                <th className="px-4 py-2 font-medium">Role(s)</th>
                <th className="px-4 py-2 font-medium">Status</th>
                <th className="px-4 py-2 font-medium">Last active</th>
                <th className="px-4 py-2 font-medium"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink-100">
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-6 text-center text-xs text-ink-400">
                    No contributors match this filter.
                  </td>
                </tr>
              )}
              {filtered.map((u) => (
                <tr key={u.id} className={selected?.id === u.id ? 'bg-brand-50/60' : ''}>
                  <td className="px-4 py-3">
                    <div className="font-medium text-ink-900">{u.name}</div>
                    <div className="text-xs text-ink-400">{u.email}</div>
                  </td>
                  <td className="px-4 py-3 text-xs text-ink-500">{u.roles.join(', ')}</td>
                  <td className="px-4 py-3">
                    <Badge tone={STATUS_TONE[u.administrativeStatus] || 'ink'}>{u.administrativeStatus}</Badge>
                  </td>
                  <td className="px-4 py-3 text-xs text-ink-500">{u.lastActive || '—'}</td>
                  <td className="px-4 py-3 text-right">
                    <button
                      className="text-xs font-medium text-brand-600 hover:underline"
                      onClick={() => selectUser(u.id)}
                    >
                      Manage →
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="card sticky top-6 h-fit p-5">
          {!selected ? (
            <p className="text-sm text-ink-400">Select a contributor to view details.</p>
          ) : (
            <div className="space-y-4">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h2 className="text-sm font-semibold text-ink-900">{selected.name}</h2>
                  <div className="text-xs text-ink-400">{selected.email}</div>
                </div>
                <Badge tone={STATUS_TONE[selected.administrativeStatus] || 'ink'}>{selected.administrativeStatus}</Badge>
              </div>

              <div className="text-xs text-ink-500">
                <div>Roles: {selected.roles.join(', ')}</div>
                <div>Country: {selected.country || '—'}{selected.stateRegion ? ` · ${selected.stateRegion}` : ''}</div>
                <div>Invited {selected.invitedOn || '—'} · Registered {selected.registeredOn || '—'}</div>
                <div>Last active {selected.lastActive || '—'}</div>
              </div>

              {selected.expertiseTags?.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {selected.expertiseTags.map((tag) => (
                    <span key={tag} className="badge bg-ink-100 text-ink-600">{tag}</span>
                  ))}
                </div>
              )}

              <div className="rounded-lg bg-ink-50 px-3 py-2 text-xs text-ink-600">
                {theirCandidates.length} Candidate{theirCandidates.length === 1 ? '' : 's'} submitted ·{' '}
                {theirContributions.length} mission contribution{theirContributions.length === 1 ? '' : 's'} on file.
                {selected.administrativeStatus === 'Deactivated' && ' None of this is affected by deactivation.'}
              </div>

              <div className="border-t border-ink-100 pt-4">
                {selected.administrativeStatus === 'Deactivated' ? (
                  <button className="btn-secondary w-full text-xs" onClick={() => reactivateContributor(selected.id)}>
                    Reactivate contributor
                  </button>
                ) : !confirmingDeactivate ? (
                  <button
                    className="w-full rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-100"
                    onClick={() => setConfirmingDeactivate(true)}
                  >
                    Deactivate contributor
                  </button>
                ) : (
                  <div className="space-y-3 rounded-lg border border-rose-200 bg-rose-50 p-3">
                    <p className="text-xs text-rose-700">
                      {selected.name} will lose access immediately. Their past Candidates and submissions are kept as
                      recorded and can be restored by reactivating them later.
                    </p>
                    <label className="flex items-start gap-2 text-xs text-ink-700">
                      <input
                        type="checkbox"
                        className="mt-0.5"
                        checked={notifyOnDeactivate}
                        onChange={(e) => setNotifyOnDeactivate(e.target.checked)}
                      />
                      <span>
                        Notify contributor by email
                        <span className="block text-[11px] text-ink-400">
                          MVP1 does not send real email — this only records the choice (User Needs Register UN-GEN-18
                          flags that a deactivated contributor otherwise gets no explanation).
                        </span>
                      </span>
                    </label>
                    <div className="flex gap-2">
                      <button
                        className="flex-1 rounded-lg bg-rose-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-rose-700"
                        onClick={handleDeactivate}
                      >
                        Confirm deactivation
                      </button>
                      <button
                        className="btn-secondary flex-1 text-xs"
                        onClick={() => setConfirmingDeactivate(false)}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

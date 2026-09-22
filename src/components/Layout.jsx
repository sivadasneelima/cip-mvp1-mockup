import React from 'react'
import { NavLink } from 'react-router-dom'
import { useDemo } from '../data/DemoContext.jsx'
import { ROLES } from '../data/mockData.js'

const ROLE_ORDER = [
  ROLES.SCOUT,
  ROLES.VALIDATOR,
  ROLES.PREDICTOR,
  ROLES.DATASET_SUPPLIER,
  ROLES.CA,
  ROLES.ADMIN,
]

function NavItem({ to, children }) {
  return (
    <NavLink
      to={to}
      end
      className={({ isActive }) =>
        `block rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
          isActive ? 'bg-brand-600 text-white' : 'text-ink-600 hover:bg-ink-100'
        }`
      }
    >
      {children}
    </NavLink>
  )
}

export default function Layout({ children }) {
  const { role, setRole, currentUser, toast } = useDemo()

  const isContributor = [ROLES.SCOUT, ROLES.VALIDATOR, ROLES.PREDICTOR, ROLES.DATASET_SUPPLIER].includes(role)

  return (
    <div className="min-h-screen bg-ink-50 text-ink-900">
      <div className="flex min-h-screen">
        <aside className="hidden w-64 shrink-0 border-r border-ink-200 bg-white md:flex md:flex-col">
          <div className="flex items-center gap-2 border-b border-ink-200 px-5 py-5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-600 text-sm font-bold text-white">
              CI
            </div>
            <div>
              <div className="text-sm font-semibold leading-tight">Biovergence</div>
              <div className="text-xs leading-tight text-ink-500">Community Intelligence</div>
            </div>
          </div>

          <nav className="flex-1 space-y-1 px-3 py-4">
            <div className="px-3 pb-1 section-title">Overview</div>
            <NavItem to="/">Dashboard</NavItem>

            {isContributor && (
              <>
                <div className="px-3 pb-1 pt-4 section-title">My missions</div>
                {role === ROLES.SCOUT && <NavItem to="/ideation/IM-1">Ideation: GLP-1 needs</NavItem>}
                {role !== ROLES.SCOUT && <NavItem to="/validation/VM-101">GLP-1 skin quality</NavItem>}
                {role !== ROLES.SCOUT && <NavItem to="/validation/VM-102">GLP-1 muscle preservation</NavItem>}
              </>
            )}

            {role === ROLES.CA && (
              <>
                <div className="px-3 pb-1 pt-4 section-title">Community</div>
                <NavItem to="/ca">Community console</NavItem>
              </>
            )}

            {role === ROLES.ADMIN && (
              <>
                <div className="px-3 pb-1 pt-4 section-title">Admin</div>
                <NavItem to="/admin/missions">Missions &amp; candidates</NavItem>
                <NavItem to="/admin/triage/IM-1">Ideation triage</NavItem>
                <NavItem to="/admin/gate/C-101">Kill-gate queue</NavItem>
              </>
            )}
          </nav>

          <div className="border-t border-ink-200 p-4 text-xs text-ink-400">
            MVP 1 prototype · mock data only
          </div>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="flex items-center justify-between gap-4 border-b border-ink-200 bg-white px-4 py-3 md:px-8">
            <div className="min-w-0">
              <div className="truncate text-sm font-semibold text-ink-900">{currentUser.name}</div>
              <div className="truncate text-xs text-ink-500">{currentUser.expertise}</div>
            </div>

            <div className="flex items-center gap-2">
              <span className="hidden text-xs text-ink-400 sm:inline">Preview as role:</span>
              <select
                className="input !w-auto py-1.5 text-sm"
                value={role}
                onChange={(e) => setRole(e.target.value)}
              >
                {ROLE_ORDER.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </div>
          </header>

          <main className="flex-1 px-4 py-6 md:px-8 md:py-8">
            <div className="mx-auto max-w-6xl">{children}</div>
          </main>
        </div>
      </div>

      {toast && (
        <div className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-lg bg-ink-900 px-4 py-2.5 text-sm text-white shadow-lg">
          {toast}
        </div>
      )}
    </div>
  )
}

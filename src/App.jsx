import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout.jsx'
import RequireRole from './components/RequireRole.jsx'
import Dashboard from './pages/Dashboard.jsx'
import ScoutMission from './pages/ScoutMission.jsx'
import ValidationSubmission from './pages/ValidationSubmission.jsx'
import AdminMissions from './pages/AdminMissions.jsx'
import AdminTriage from './pages/AdminTriage.jsx'
import AdminKillGate from './pages/AdminKillGate.jsx'
import CAConsole from './pages/CAConsole.jsx'
import { ROLES } from './data/mockData.js'

const CONTRIBUTOR_VALIDATION_ROLES = [ROLES.VALIDATOR, ROLES.PREDICTOR, ROLES.DATASET_SUPPLIER]

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Dashboard />} />

        <Route
          path="/ideation/:missionId"
          element={
            <RequireRole allow={[ROLES.SCOUT]}>
              <ScoutMission />
            </RequireRole>
          }
        />

        <Route
          path="/validation/:missionId"
          element={
            <RequireRole allow={CONTRIBUTOR_VALIDATION_ROLES}>
              <ValidationSubmission />
            </RequireRole>
          }
        />

        <Route
          path="/ca"
          element={
            <RequireRole allow={[ROLES.CA]}>
              <CAConsole />
            </RequireRole>
          }
        />

        <Route
          path="/admin/missions"
          element={
            <RequireRole allow={[ROLES.ADMIN]}>
              <AdminMissions />
            </RequireRole>
          }
        />
        <Route
          path="/admin/triage/:missionId"
          element={
            <RequireRole allow={[ROLES.ADMIN]}>
              <AdminTriage />
            </RequireRole>
          }
        />
        <Route
          path="/admin/gate/:candidateId"
          element={
            <RequireRole allow={[ROLES.ADMIN]}>
              <AdminKillGate />
            </RequireRole>
          }
        />

        <Route path="*" element={<Dashboard />} />
      </Routes>
    </Layout>
  )
}

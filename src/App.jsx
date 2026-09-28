import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout.jsx'
import RequireRole from './components/RequireRole.jsx'
import Login from './pages/Login.jsx'
import Dashboard from './pages/Dashboard.jsx'
import ScoutMission from './pages/ScoutMission.jsx'
import ScoutSubmit from './pages/ScoutSubmit.jsx'
import ScoutConfirm from './pages/ScoutConfirm.jsx'
import MyHypotheses from './pages/MyHypotheses.jsx'
import Profile from './pages/Profile.jsx'
import ValidationSubmission from './pages/ValidationSubmission.jsx'
import AdminMissions from './pages/AdminMissions.jsx'
import AdminTriage from './pages/AdminTriage.jsx'
import AdminKillGate from './pages/AdminKillGate.jsx'
import AdminContributors from './pages/AdminContributors.jsx'
import CAConsole from './pages/CAConsole.jsx'
import { ROLES } from './data/mockData.js'
import { useDemo } from './data/DemoContext.jsx'

const CONTRIBUTOR_VALIDATION_ROLES = [ROLES.VALIDATOR, ROLES.PREDICTOR, ROLES.DATASET_SUPPLIER]
const ALL_CONTRIBUTOR_ROLES = [ROLES.SCOUT, ...CONTRIBUTOR_VALIDATION_ROLES]
const PROFILE_ROLES = [...ALL_CONTRIBUTOR_ROLES, ROLES.CA]

export default function App() {
  const { currentUser } = useDemo()

  // No signed-in identity — show the sign-in screen, not the app shell. Every
  // other route below assumes a logged-in `currentUser`; RequireRole and the
  // pages themselves never have to handle a null one.
  if (!currentUser) return <Login />

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
          path="/ideation/:missionId/submit"
          element={
            <RequireRole allow={[ROLES.SCOUT]}>
              <ScoutSubmit />
            </RequireRole>
          }
        />
        <Route
          path="/ideation/:missionId/confirm/:candidateId"
          element={
            <RequireRole allow={[ROLES.SCOUT]}>
              <ScoutConfirm />
            </RequireRole>
          }
        />
        <Route
          path="/my-hypotheses"
          element={
            <RequireRole allow={[ROLES.SCOUT]}>
              <MyHypotheses />
            </RequireRole>
          }
        />

        <Route
          path="/profile"
          element={
            <RequireRole allow={PROFILE_ROLES}>
              <Profile />
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
        <Route
          path="/admin/contributors"
          element={
            <RequireRole allow={[ROLES.ADMIN]}>
              <AdminContributors />
            </RequireRole>
          }
        />

        <Route path="*" element={<Dashboard />} />
      </Routes>
    </Layout>
  )
}

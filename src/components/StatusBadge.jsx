import React from 'react'
import { adminCandidateStatus, memberCandidateStatus } from '../data/mockData.js'

const TONE_CLASSES = {
  brand: 'bg-brand-100 text-brand-700',
  amber: 'bg-amber-100 text-amber-600',
  rose: 'bg-rose-100 text-rose-600',
  ink: 'bg-ink-100 text-ink-600',
}

// Admin/CA-facing Candidate status. Takes the whole candidate, not just its
// status string, because Parked and Killed are both stored as status
// "Suspended" — only statusReasonCode tells them apart (see
// adminCandidateStatus), so a bare status string can't render the right
// label here even on the team's own screens.
export function CandidateStatusBadge({ candidate, status }) {
  const { label, tone } = adminCandidateStatus(candidate || { status })
  return <span className={`badge ${TONE_CLASSES[tone]}`}>{label}</span>
}

export function Badge({ tone = 'ink', children }) {
  return <span className={`badge ${TONE_CLASSES[tone] || TONE_CLASSES.ink}`}>{children}</span>
}

// Contributor-facing Candidate status — always one of the five PDD Section 6
// terms (plus Merged), never the finer Admin/CA vocabulary above. Use this on
// any screen a Scout/Validator/Predictor/Dataset Supplier sees, and reserve
// CandidateStatusBadge for Admin/CA screens.
export function MemberCandidateStatusBadge({ candidate }) {
  const { label, tone } = memberCandidateStatus(candidate)
  return <span className={`badge ${TONE_CLASSES[tone]}`}>{label}</span>
}

export function MissionStatusBadge({ status }) {
  const map = {
    Draft: 'ink',
    Active: 'brand',
    Triaging: 'amber',
    'On-Hold': 'amber',
    Closed: 'ink',
  }
  return <Badge tone={map[status] || 'ink'}>{status}</Badge>
}

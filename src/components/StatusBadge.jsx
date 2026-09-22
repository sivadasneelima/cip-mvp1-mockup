import React from 'react'
import { CANDIDATE_STATUS_LABEL, CANDIDATE_STATUS_TONE } from '../data/mockData.js'

const TONE_CLASSES = {
  brand: 'bg-brand-100 text-brand-700',
  amber: 'bg-amber-100 text-amber-600',
  rose: 'bg-rose-100 text-rose-600',
  ink: 'bg-ink-100 text-ink-600',
}

export function CandidateStatusBadge({ status }) {
  const tone = CANDIDATE_STATUS_TONE[status] || 'ink'
  const label = CANDIDATE_STATUS_LABEL[status] || status
  return <span className={`badge ${TONE_CLASSES[tone]}`}>{label}</span>
}

export function Badge({ tone = 'ink', children }) {
  return <span className={`badge ${TONE_CLASSES[tone] || TONE_CLASSES.ink}`}>{children}</span>
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

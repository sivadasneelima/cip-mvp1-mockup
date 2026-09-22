// Mock data for the Community Intelligence Platform (CIP) MVP 1 mockup.
// Shapes follow PDD v1.4 Section 5 (Data Structure Recommendation).
// This is demo data only — no backend, nothing persists across a page reload.

export const ROLES = {
  SCOUT: 'Scout',
  VALIDATOR: 'Validator',
  PREDICTOR: 'Predictor',
  DATASET_SUPPLIER: 'Dataset Supplier',
  CA: 'Community Ambassador',
  ADMIN: 'BioV Admin',
}

// UI-facing vocabulary only — see PDD Section 1.4. "Kill" is never shown to users.
export const CANDIDATE_STATUS_LABEL = {
  Proposed: 'Proposed',
  Shortlisted: 'Shortlisted',
  Active: 'Active',
  Gated: 'Under review',
  InValidation: 'In validation',
  Resolved: 'Resolved',
  Suspended: 'Not selected / Suspended',
  Merged: 'Merged',
}

export const CANDIDATE_STATUS_TONE = {
  Proposed: 'ink',
  Shortlisted: 'brand',
  Active: 'brand',
  Gated: 'amber',
  InValidation: 'amber',
  Resolved: 'brand',
  Suspended: 'rose',
  Merged: 'ink',
}

export const users = [
  { id: 'u1', name: 'Dana Okafor', roles: [ROLES.SCOUT], expertise: 'Consumer trends, GLP-1 adjacent markets' },
  { id: 'u2', name: 'Marcus Lin', roles: [ROLES.SCOUT], expertise: 'Dermatology, cosmetic formulation' },
  { id: 'u3', name: 'Priya Nandakumar', roles: [ROLES.VALIDATOR], expertise: 'Dermatologist, MD' },
  { id: 'u4', name: 'Sam Whitfield', roles: [ROLES.VALIDATOR, ROLES.PREDICTOR], expertise: 'Consumer-health commercial strategy' },
  { id: 'u5', name: 'Elena Vasquez', roles: [ROLES.PREDICTOR], expertise: 'Forecasting, behavioral data science' },
  { id: 'u6', name: 'Raj Patel', roles: [ROLES.DATASET_SUPPLIER], expertise: 'Retail panel data, demand analytics' },
  { id: 'u7', name: 'Grace Kim', roles: [ROLES.CA], expertise: 'Community operations' },
  { id: 'u8', name: 'JW (you)', roles: [ROLES.ADMIN], expertise: 'BioV Administrator' },
]

export const CURRENT_USER_BY_ROLE = {
  [ROLES.SCOUT]: users[0],
  [ROLES.VALIDATOR]: users[2],
  [ROLES.PREDICTOR]: users[4],
  [ROLES.DATASET_SUPPLIER]: users[5],
  [ROLES.CA]: users[6],
  [ROLES.ADMIN]: users[7],
}

export const ideationMissions = [
  {
    id: 'IM-1',
    title: 'Underserved needs among GLP-1 users',
    prompt:
      'Identify an underserved healthy-aging/recovery need among U.S. consumers 35–55, adjacent to GLP-1 use, that could plausibly support a compliant product launched within six months.',
    status: 'Triaging',
    createdDate: '2026-08-10',
  },
  {
    id: 'IM-2',
    title: 'Sleep & recovery adjacent opportunities',
    prompt:
      'Identify an underserved sleep or recovery need among U.S. consumers 30–60 that could support a compliant consumer-health product.',
    status: 'Active',
    createdDate: '2026-09-05',
  },
]

// Candidates generated from IM-1, already triaged by Admin per the PDD's worked example (Section "Narrative Example").
export const candidates = [
  {
    id: 'C-101',
    parentMissionId: 'IM-1',
    validationMissionId: 'VM-101',
    title: 'GLP-1 skin quality support',
    hypothesis:
      'GLP-1 users experience visible skin laxity/dullness during rapid weight loss and would pay for a targeted skin-quality supplement or topical.',
    submittedBy: 'u2',
    sourceType: 'Scout-generated',
    tags: ['dermatology', 'GLP-1', 'skin'],
    evidence: 'Reddit/forum thread analysis (42 threads); 3 dermatology case reports (links attached).',
    confidenceLevel: 'High',
    status: 'Gated',
    statusReasonCode: null,
    createdDate: '2026-08-14',
  },
  {
    id: 'C-102',
    parentMissionId: 'IM-1',
    validationMissionId: 'VM-102',
    title: 'GLP-1 muscle preservation',
    hypothesis:
      'GLP-1 users lose lean muscle mass alongside fat and would adopt a protein/creatine-forward regimen designed for their profile.',
    submittedBy: 'u1',
    sourceType: 'Scout-generated',
    tags: ['muscle', 'GLP-1', 'nutrition'],
    evidence: 'Two published clinical studies on lean-mass loss during GLP-1 therapy; consumer survey (n=180).',
    confidenceLevel: 'Medium',
    status: 'Active',
    statusReasonCode: null,
    createdDate: '2026-08-14',
  },
  {
    id: 'C-103',
    parentMissionId: 'IM-1',
    validationMissionId: 'VM-103',
    title: 'GLP-1 & perimenopause overlap',
    hypothesis:
      'Perimenopausal women on GLP-1 therapy face compounded symptom burden (sleep, mood, weight) and are underserved by existing SKUs.',
    submittedBy: 'u1',
    sourceType: 'Scout-generated',
    tags: ['perimenopause', 'GLP-1'],
    evidence: 'Demand-signal search data; 6 corroborating Scout submissions across two missions.',
    confidenceLevel: 'High',
    status: 'Resolved',
    statusReasonCode: null,
    createdDate: '2026-08-14',
  },
  {
    id: 'C-104',
    parentMissionId: 'IM-1',
    validationMissionId: null,
    title: 'GLP-1 hair loss',
    hypothesis: 'Telogen effluvium during rapid weight loss is a common but under-addressed GLP-1 side effect.',
    submittedBy: 'u2',
    sourceType: 'Scout-generated',
    tags: ['hair', 'GLP-1'],
    evidence: 'Single forum thread, no corroborating source yet.',
    confidenceLevel: 'Low',
    status: 'Suspended',
    statusReasonCode: 'not-shortlisted',
    createdDate: '2026-08-14',
  },
  {
    id: 'C-105',
    parentMissionId: 'IM-1',
    validationMissionId: null,
    title: 'GLP-1 GI tolerance aids',
    hypothesis: 'GI tolerance issues (nausea, reflux) during dose titration create demand for an adjunct comfort product.',
    submittedBy: 'u1',
    sourceType: 'Scout-generated',
    tags: ['GI', 'GLP-1'],
    evidence: 'Overlaps substantially with an existing OTC category; weak differentiation case.',
    confidenceLevel: 'Low',
    status: 'Suspended',
    statusReasonCode: 'not-shortlisted',
    createdDate: '2026-08-14',
  },
]

// Kill-gate configuration lives on the Validation Mission (Section 3.4 / 5.4).
export const validationMissions = [
  {
    id: 'VM-101',
    candidateId: 'C-101',
    title: 'Validation — GLP-1 skin quality support',
    status: 'Closed', // input collection closed; Candidate is Gated / Under Review
    contributors: [
      { userId: 'u3', role: ROLES.VALIDATOR },
      { userId: 'u4', role: ROLES.VALIDATOR },
      { userId: 'u5', role: ROLES.PREDICTOR },
      { userId: 'u6', role: ROLES.DATASET_SUPPLIER },
    ],
    killGates: [
      {
        id: 'G-101a',
        label: 'Validator advance consensus',
        type: 'quantitative',
        boundField: 'recommendation',
        threshold: '≥ 66% of Active Validator recommendations = Advance',
      },
      {
        id: 'G-101b',
        label: 'Predictor conversion confidence',
        type: 'quantitative',
        boundField: 'conversionProbability',
        threshold: '≥ 20% median estimated conversion',
      },
      {
        id: 'G-101c',
        label: 'Scientific plausibility (qualitative)',
        type: 'qualitative',
        boundField: null,
        threshold: 'Admin judgement — no adverse dermatological signal in evidence reviewed',
      },
    ],
  },
  {
    id: 'VM-102',
    candidateId: 'C-102',
    title: 'Validation — GLP-1 muscle preservation',
    status: 'Active',
    contributors: [
      { userId: 'u4', role: ROLES.VALIDATOR },
      { userId: 'u5', role: ROLES.PREDICTOR },
      { userId: 'u6', role: ROLES.DATASET_SUPPLIER },
    ],
    killGates: [
      {
        id: 'G-102a',
        label: 'Validator advance consensus',
        type: 'quantitative',
        boundField: 'recommendation',
        threshold: '≥ 60% of Active Validator recommendations = Advance',
      },
    ],
  },
  {
    id: 'VM-103',
    candidateId: 'C-103',
    title: 'Validation — GLP-1 & perimenopause overlap',
    status: 'Closed',
    contributors: [
      { userId: 'u3', role: ROLES.VALIDATOR },
      { userId: 'u4', role: ROLES.VALIDATOR },
      { userId: 'u5', role: ROLES.PREDICTOR },
    ],
    killGates: [
      {
        id: 'G-103a',
        label: 'Validator advance consensus',
        type: 'quantitative',
        boundField: 'recommendation',
        threshold: '≥ 60% of Active Validator recommendations = Advance',
      },
    ],
  },
]

// Validation Mission Contribution records (Section 5.2).
export const contributions = [
  // --- C-101 (Gated / Under Review — ready for kill-gate demo) ---
  {
    id: 'CT-1001',
    contributorId: 'u3',
    role: ROLES.VALIDATOR,
    missionId: 'VM-101',
    candidateId: 'C-101',
    content: {
      noiseOrNiche: 'Corroborated niche, not noise',
      plausibilityFlag: 'Plausible',
      channelAssessment: 'DTC + dermatologist channel both viable',
      recommendation: 'Advance',
    },
    evidence: 'Attached: 2 peer-reviewed abstracts on GLP-1 skin laxity.',
    confidenceLevel: 'High',
    status: 'Active',
    timestamp: '2026-08-20',
  },
  {
    id: 'CT-1002',
    contributorId: 'u4',
    role: ROLES.VALIDATOR,
    missionId: 'VM-101',
    candidateId: 'C-101',
    content: {
      noiseOrNiche: 'Corroborated niche',
      plausibilityFlag: 'Plausible',
      channelAssessment: 'DTC preferred; regulatory review needed for topical claims',
      recommendation: 'More evidence is required',
    },
    evidence: 'Source link: competitor claims substantiation summary.',
    confidenceLevel: 'Medium',
    status: 'Active',
    timestamp: '2026-08-21',
  },
  {
    id: 'CT-1003',
    contributorId: 'u5',
    role: ROLES.PREDICTOR,
    missionId: 'VM-101',
    candidateId: 'C-101',
    content: {
      forecast: 'Probability this niche converts at ≥20%',
      conversionProbability: 24,
      rationale: 'Comparable SKUs in adjacent categories cluster at 18–27% trial-to-repeat conversion.',
    },
    evidence: 'Comparable-sales model attached (xlsx).',
    confidenceLevel: 'Medium',
    status: 'Active',
    timestamp: '2026-08-22',
  },
  {
    id: 'CT-1004',
    contributorId: 'u6',
    role: ROLES.DATASET_SUPPLIER,
    missionId: 'VM-101',
    candidateId: 'C-101',
    content: {
      dataType: 'Search & demand data',
      summary: 'Search volume for "GLP-1 skin" +340% YoY; low existing branded-SKU saturation.',
    },
    evidence: 'Retail panel export attached (csv).',
    confidenceLevel: 'High',
    status: 'Active',
    timestamp: '2026-08-19',
  },
  // --- C-102 (Active — still collecting) ---
  {
    id: 'CT-1005',
    contributorId: 'u4',
    role: ROLES.VALIDATOR,
    missionId: 'VM-102',
    candidateId: 'C-102',
    content: {
      noiseOrNiche: 'Corroborated niche',
      plausibilityFlag: 'Plausible',
      channelAssessment: 'Sports-nutrition adjacent channel',
      recommendation: 'Advance',
    },
    evidence: 'Two clinical study links attached.',
    confidenceLevel: 'High',
    status: 'Active',
    timestamp: '2026-09-02',
  },
  // --- C-103 (Resolved — already advanced, shown for dashboard history) ---
  {
    id: 'CT-1006',
    contributorId: 'u3',
    role: ROLES.VALIDATOR,
    missionId: 'VM-103',
    candidateId: 'C-103',
    content: {
      noiseOrNiche: 'Corroborated niche',
      plausibilityFlag: 'Plausible',
      channelAssessment: 'DTC subscription',
      recommendation: 'Advance',
    },
    evidence: 'Demand-signal deck attached.',
    confidenceLevel: 'High',
    status: 'Active',
    timestamp: '2026-08-18',
  },
]

// Kill-Gate Determination records (Section 5.6) — populated only after Admin acts.
// Kept as a mutable seed array; the demo UI appends to a copy held in DemoContext.
export const killGateDeterminations = []

// Q&A threads (Section 4.6, option 2 — lightweight, role-scoped, mission-scoped).
export const qaThreads = {
  'IM-1': [
    {
      role: ROLES.SCOUT,
      posts: [
        {
          id: 'Q-1',
          author: 'Dana Okafor',
          authorRole: ROLES.SCOUT,
          body: 'Can we submit more than one hypothesis if they overlap slightly (e.g., skin + hydration)?',
          timestamp: '2026-08-11 09:14',
        },
        {
          id: 'Q-2',
          author: 'Grace Kim',
          authorRole: ROLES.CA,
          body: 'Yes — submit them as separate Candidates. Admin will merge during triage if they turn out to be the same underlying idea.',
          timestamp: '2026-08-11 11:02',
        },
      ],
    },
  ],
  'VM-101': [
    {
      role: ROLES.VALIDATOR,
      posts: [
        {
          id: 'Q-3',
          author: 'Priya Nandakumar',
          authorRole: ROLES.VALIDATOR,
          body: 'Should the recommendation reflect topical-only feasibility, or also an oral supplement path?',
          timestamp: '2026-08-19 15:40',
        },
        {
          id: 'Q-4',
          author: 'Grace Kim',
          authorRole: ROLES.CA,
          body: 'Assess both paths if you have evidence for either — note which path each comment applies to.',
          timestamp: '2026-08-19 16:05',
        },
      ],
    },
  ],
}

export const submissionStatusForMember = {
  // Canonical member-facing vocabulary (Section 6): Submitted, Under Review, Advanced, Parked, Not selected
  'CT-1001': 'Under review',
  'CT-1002': 'Under review',
  'CT-1003': 'Under review',
  'CT-1004': 'Under review',
  'CT-1005': 'Submitted',
  'CT-1006': 'Advanced',
}

export function getUser(id) {
  return users.find((u) => u.id === id)
}

export function getCandidate(id) {
  return candidates.find((c) => c.id === id)
}

export function getValidationMission(id) {
  return validationMissions.find((m) => m.id === id)
}

export function getIdeationMission(id) {
  return ideationMissions.find((m) => m.id === id)
}

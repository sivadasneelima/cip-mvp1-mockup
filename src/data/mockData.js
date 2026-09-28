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

// Admin/CA-facing vocabulary — the fuller, internal Candidate lifecycle
// (Section 5.3), useful to the team for distinguishing Proposed from
// Shortlisted from Gated. All labels are Title Case for consistent badge
// styling. See PDD Section 1.4 — "Kill" is never shown to anyone here either,
// admin or member; "Suspended" is included in the label as the only place
// that internal term is shown at all, and only to the team, never a
// contributor (see MEMBER_CANDIDATE_STATUS below for what a contributor sees
// instead — a Scout is never shown "Gated" or "Suspended").
export const CANDIDATE_STATUS_LABEL = {
  Proposed: 'Proposed',
  Shortlisted: 'Shortlisted',
  Active: 'Active',
  Gated: 'Under Review',
  InValidation: 'In Validation',
  Resolved: 'Resolved',
  Suspended: 'Not Selected / Suspended',
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

// The three Suspended reason codes (not-shortlisted at triage, parked-at-gate,
// killed-at-gate) were all folding into one flat "Not Selected / Suspended"
// label above — fine for a contributor (who's never shown the difference
// between Park and Kill at all, see memberCandidateStatus below), but that
// left the Admin's own Candidate pool table with no way to tell a Parked
// Candidate apart from a Killed one at a glance, which defeats the point of
// Park existing as a distinct, revisitable outcome. This is the Admin/CA
// resolver that actually looks at statusReasonCode; CandidateStatusBadge
// takes the whole candidate now, not just its status, so it can call this.
export function adminCandidateStatus(candidate) {
  if (candidate?.status === 'Suspended') {
    if (candidate.statusReasonCode === 'parked-at-gate') return { label: 'Parked', tone: 'amber' }
    if (candidate.statusReasonCode === 'killed-at-gate') return { label: 'Killed', tone: 'rose' }
    return { label: 'Not Selected (not shortlisted)', tone: 'rose' }
  }
  return {
    label: CANDIDATE_STATUS_LABEL[candidate?.status] || candidate?.status,
    tone: CANDIDATE_STATUS_TONE[candidate?.status] || 'ink',
  }
}

// Member-facing vocabulary (PDD Section 6): a contributor only ever sees one
// of Submitted / Under Review / Advanced / Parked / Not Selected — never the
// finer-grained internal status names above. "Merged" is the one addition,
// since a Scout specifically needs to know their idea was folded into
// another one, not just "still under review".
export function memberCandidateStatus(candidate) {
  switch (candidate?.status) {
    case 'Proposed':
      return { label: 'Submitted', tone: 'ink' }
    case 'Merged':
      return { label: 'Merged', tone: 'ink' }
    case 'Suspended':
      return candidate.statusReasonCode === 'parked-at-gate'
        ? { label: 'Parked', tone: 'amber' }
        : { label: 'Not Selected', tone: 'rose' }
    case 'InValidation':
    case 'Resolved':
      return { label: 'Advanced', tone: 'brand' }
    // Shortlisted, Active, Gated — all still open, none resolved yet.
    default:
      return { label: 'Under Review', tone: 'amber' }
  }
}

// Contributor record fields (PDD v1.5 Section 5.7) live directly on the user
// object here rather than in a parallel array, so there is only ever one
// place to look someone up — the same lesson learned from the earlier
// Candidate-lookup bug. `expertise` is the free-text line shown in the header
// (unchanged); `expertiseTags` is the new structured tag list used for
// mission/Candidate matching (PDD 5.7) and edited on the Profile screen.
export const users = [
  {
    id: 'u1',
    name: 'Dana Okafor',
    email: 'dana.okafor@example.com',
    roles: [ROLES.SCOUT],
    expertise: 'Consumer trends, GLP-1 adjacent markets',
    expertiseTags: ['Consumer health', 'Behavioural science'],
    administrativeStatus: 'Active',
    country: 'us',
    stateRegion: 'Illinois',
    bio: 'Consumer insights lead tracking GLP-1-adjacent purchase behaviour across U.S. retail panels.',
    linkedIn: 'linkedin.com/in/danaokafor',
    resumeFileName: 'dana-okafor-cv.pdf',
    invitedOn: '2026-08-05',
    registeredOn: '2026-08-06',
    lastActive: '2026-09-19',
  },
  {
    id: 'u2',
    name: 'Marcus Lin',
    email: 'marcus.lin@example.com',
    roles: [ROLES.SCOUT],
    expertise: 'Dermatology, cosmetic formulation',
    expertiseTags: ['Dermatology', 'Formulation'],
    administrativeStatus: 'Active',
    country: 'ca',
    stateRegion: 'Ontario',
    bio: '',
    linkedIn: '',
    resumeFileName: null,
    invitedOn: '2026-08-05',
    registeredOn: '2026-08-07',
    lastActive: '2026-09-14',
  },
  {
    id: 'u3',
    name: 'Priya Nandakumar',
    email: 'priya.nandakumar@example.com',
    roles: [ROLES.VALIDATOR],
    expertise: 'Dermatologist, MD',
    expertiseTags: ['Dermatology', 'Clinical research'],
    administrativeStatus: 'Active',
    country: 'us',
    stateRegion: 'Massachusetts',
    bio: 'Practicing dermatologist, 12 years; clinical research on weight-loss-related skin change.',
    linkedIn: 'linkedin.com/in/priyanandakumar',
    resumeFileName: 'priya-nandakumar-cv.pdf',
    invitedOn: '2026-08-10',
    registeredOn: '2026-08-11',
    lastActive: '2026-09-21',
  },
  {
    id: 'u4',
    name: 'Sam Whitfield',
    email: 'sam.whitfield@example.com',
    roles: [ROLES.VALIDATOR, ROLES.PREDICTOR],
    expertise: 'Consumer-health commercial strategy',
    expertiseTags: ['Consumer health', 'Retail and channel'],
    administrativeStatus: 'Active',
    country: 'us',
    stateRegion: 'California',
    bio: '',
    linkedIn: '',
    resumeFileName: null,
    invitedOn: '2026-08-10',
    registeredOn: '2026-08-12',
    lastActive: '2026-09-20',
  },
  {
    id: 'u5',
    name: 'Elena Vasquez',
    email: 'elena.vasquez@example.com',
    roles: [ROLES.PREDICTOR],
    expertise: 'Forecasting, behavioral data science',
    expertiseTags: ['Behavioural science', 'Clinical research'],
    administrativeStatus: 'Active',
    country: 'uk',
    stateRegion: '',
    bio: '',
    linkedIn: '',
    resumeFileName: null,
    invitedOn: '2026-08-10',
    registeredOn: '2026-08-13',
    lastActive: '2026-09-18',
  },
  {
    id: 'u6',
    name: 'Raj Patel',
    email: 'raj.patel@example.com',
    roles: [ROLES.DATASET_SUPPLIER],
    expertise: 'Retail panel data, demand analytics',
    expertiseTags: ['Retail and channel'],
    administrativeStatus: 'Active',
    country: 'us',
    stateRegion: 'Texas',
    bio: '',
    linkedIn: '',
    resumeFileName: null,
    invitedOn: '2026-08-10',
    registeredOn: '2026-08-14',
    lastActive: '2026-09-10',
  },
  {
    id: 'u7',
    name: 'Grace Kim',
    email: 'grace.kim@example.com',
    roles: [ROLES.CA],
    expertise: 'Community operations',
    expertiseTags: [],
    administrativeStatus: 'Active',
    country: 'us',
    stateRegion: 'New York',
    bio: '',
    linkedIn: '',
    resumeFileName: null,
    invitedOn: '2026-07-20',
    registeredOn: '2026-07-21',
    lastActive: '2026-09-22',
  },
  {
    id: 'u8',
    name: 'JW (you)',
    email: 'jw@biovergence.com',
    roles: [ROLES.ADMIN],
    expertise: 'BioV Administrator',
    expertiseTags: [],
    administrativeStatus: 'Active',
    country: 'us',
    stateRegion: '',
    bio: '',
    linkedIn: '',
    resumeFileName: null,
    invitedOn: '2026-07-01',
    registeredOn: '2026-07-01',
    lastActive: '2026-09-22',
  },
]

// Stable id, not array index, so switching to stateful `users` in
// DemoContext (needed once profile edits / deactivation can happen at
// runtime) never has to worry about the array being re-ordered or copied.
export const CURRENT_USER_ID_BY_ROLE = {
  [ROLES.SCOUT]: 'u1',
  [ROLES.VALIDATOR]: 'u3',
  [ROLES.PREDICTOR]: 'u5',
  [ROLES.DATASET_SUPPLIER]: 'u6',
  [ROLES.CA]: 'u7',
  [ROLES.ADMIN]: 'u8',
}

export const ADMINISTRATIVE_STATUSES = ['Invited', 'Registered', 'Active', 'Inactive', 'Deactivated']

export const COUNTRY_OPTIONS = [
  { value: 'us', label: 'United States' },
  { value: 'uk', label: 'United Kingdom' },
  { value: 'ca', label: 'Canada' },
  { value: 'other', label: 'Other' },
]

// PDD 5.7 "expertise areas" — used to match contributors to Candidates.
// Taxonomy values are themselves still undefined per UN-ORG-06; this is a
// representative starter set for the mockup only.
export const EXPERTISE_TAG_OPTIONS = [
  'Nutrition science',
  'Dermatology',
  'Consumer health',
  'Clinical research',
  'Retail and channel',
  'Regulatory affairs',
  'Formulation',
  'Behavioural science',
]

// Scout hypothesis categories (PDD Section 1.1 role table).
export const HYPOTHESIS_TYPE_OPTIONS = [
  { value: 'demand', label: 'Demand pocket' },
  { value: 'symptom', label: 'Symptom cluster' },
  { value: 'formulation', label: 'Formulation complaint' },
  { value: 'pov', label: 'Unmet-need point of view' },
  { value: 'proof', label: 'Source proof' },
]

// Descriptive confidence labels (PDD 4.1's confidence option, all roles) —
// applied first on the Scout submission screen.
export const CONFIDENCE_OPTIONS = [
  { value: 'Low', label: 'Low — a hunch worth testing' },
  { value: 'Medium', label: 'Medium — consistent signal, thin evidence' },
  { value: 'High', label: 'High — I would act on this myself' },
]

export const ideationMissions = [
  {
    id: 'IM-1',
    title: 'Underserved needs among GLP-1 users',
    prompt:
      'Identify an underserved healthy-aging/recovery need among U.S. consumers 35–55, adjacent to GLP-1 use, that could plausibly support a compliant product launched within six months.',
    status: 'Triaging',
    createdDate: '2026-08-10',
    // Deadline has passed and triage is underway — the countdown card computes
    // "Closed" from this date at render time (src/lib/deadlines.js), not from
    // a stored day-count, so it stays correct no matter when this is run.
    deadline: '2026-09-08',
    inScope: [
      'Demand pockets, symptom clusters, formulation complaints, unmet-need points of view',
      'Needs adjacent to GLP-1 use, including side-effect burden and post-treatment maintenance',
      'Several unrelated hypotheses from one Scout — divergence is the point of this stage',
    ],
    outOfScope: [
      'Prescription pharmaceuticals and anything requiring a new clinical programme',
      'Markets outside the United States',
      "Assessment of how good an idea is — that is the Validators' task, not yours",
    ],
  },
  {
    id: 'IM-2',
    title: 'Sleep & recovery adjacent opportunities',
    prompt:
      'Identify an underserved sleep or recovery need among U.S. consumers 30–60 that could support a compliant consumer-health product.',
    status: 'Active',
    createdDate: '2026-09-05',
    // Kept a few weeks out from today so a client demo run any time soon
    // still shows a live countdown rather than "Closed" — computed live from
    // this date, see src/lib/deadlines.js.
    deadline: '2026-10-16',
    inScope: [
      'Demand pockets, symptom clusters, formulation complaints, unmet-need points of view',
      'Needs tied to sleep quality, recovery, or shift-work schedules',
      'Several unrelated hypotheses from one Scout — divergence is the point of this stage',
    ],
    outOfScope: [
      'Prescription pharmaceuticals and anything requiring a new clinical programme',
      'Markets outside the United States',
      "Assessment of how good an idea is — that is the Validators' task, not yours",
    ],
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
    hypothesisType: 'symptom',
    tags: ['dermatology', 'GLP-1', 'skin'],
    evidence: 'Reddit/forum thread analysis (42 threads); 3 dermatology case reports (links attached).',
    evidenceLinks: ['https://www.aad.org/member/practice/…/weight-loss-dermatology-trends'],
    evidenceFileName: 'derm-case-reports.pdf',
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
    hypothesisType: 'demand',
    tags: ['muscle', 'GLP-1', 'nutrition'],
    evidence: 'Two published clinical studies on lean-mass loss during GLP-1 therapy; consumer survey (n=180).',
    evidenceLinks: [],
    evidenceFileName: 'lean-mass-survey.xlsx',
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
    hypothesisType: 'pov',
    tags: ['perimenopause', 'GLP-1'],
    evidence: 'Demand-signal search data; 6 corroborating Scout submissions across two missions.',
    evidenceLinks: [],
    evidenceFileName: null,
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
    hypothesisType: 'symptom',
    tags: ['hair', 'GLP-1'],
    evidence: 'Single forum thread, no corroborating source yet.',
    evidenceLinks: [],
    evidenceFileName: null,
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
    hypothesisType: 'symptom',
    tags: ['GI', 'GLP-1'],
    evidence: 'Overlaps substantially with an existing OTC category; weak differentiation case.',
    evidenceLinks: [],
    evidenceFileName: null,
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
    // Deadline dates below are read live via src/lib/deadlines.js (daysUntil /
    // isMissionOpen) wherever Phase 2/3 screens display them — never store a
    // pre-computed day-count next to a date, see the IM-2 fix above.
    deadline: '2026-09-05',
    forecastResolutionCriteria: 'Resolves Advance if trial-to-repeat conversion on a pilot SKU reaches 20%+ within the first 90 days of DTC launch.',
    forecastResolutionDate: '2026-12-15',
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
    deadline: '2026-10-20',
    forecastResolutionCriteria: 'Resolves Advance if a pilot cohort shows measurable lean-mass retention versus a non-supplemented control at 90 days.',
    forecastResolutionDate: '2027-01-10',
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
    deadline: '2026-09-01',
    forecastResolutionCriteria: 'Resolves Advance if the Resolved determination on this Candidate is Advance.',
    forecastResolutionDate: '2026-09-20',
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
  // IM-2 is the mission Scouts are actively demoed on — seeded so the brief
  // screen's Q&A thread isn't empty on first look.
  'IM-2': [
    {
      role: ROLES.SCOUT,
      posts: [
        {
          id: 'Q-5',
          author: 'Marcus Kell',
          authorRole: ROLES.SCOUT,
          body: 'Does a need that only shows up after someone stops GLP-1-adjacent sleep aids still count, or does it have to be an ongoing-use complaint?',
          timestamp: '2026-09-06 10:22',
        },
        {
          id: 'Q-6',
          author: 'Grace Kim',
          authorRole: ROLES.CA,
          body: 'In scope either way — state which one you’re assuming in your rationale so Validators assess the same claim you were.',
          timestamp: '2026-09-06 13:47',
        },
      ],
    },
  ],
  // VM-102 is the one Active Validation Mission a Validator, Predictor, or
  // Dataset Supplier actually lands on right now — each role gets its own
  // seeded thread so "Clarifying questions" isn't empty for any of them.
  'VM-102': [
    {
      role: ROLES.VALIDATOR,
      posts: [
        {
          id: 'Q-7',
          author: 'Sam Whitfield',
          authorRole: ROLES.VALIDATOR,
          body: 'Should the recommendation weigh general sports-nutrition products as existing competition, or only GLP-1-specific SKUs?',
          timestamp: '2026-09-08 11:05',
        },
        {
          id: 'Q-8',
          author: 'Grace Kim',
          authorRole: ROLES.CA,
          body: 'Treat general sports-nutrition products as adjacent competition, not direct — note the distinction in your assessment.',
          timestamp: '2026-09-08 14:30',
        },
      ],
    },
    {
      role: ROLES.PREDICTOR,
      posts: [
        {
          id: 'Q-9',
          author: 'Elena Vasquez',
          authorRole: ROLES.PREDICTOR,
          body: 'Is the forecast asking about a standalone SKU launch, or an add-on to an existing product line?',
          timestamp: '2026-09-09 09:12',
        },
        {
          id: 'Q-10',
          author: 'Grace Kim',
          authorRole: ROLES.CA,
          body: 'Standalone SKU — the resolution criteria on your forecast request assumes a dedicated pilot launch.',
          timestamp: '2026-09-09 10:03',
        },
      ],
    },
    {
      role: ROLES.DATASET_SUPPLIER,
      posts: [
        {
          id: 'Q-11',
          author: 'Raj Patel',
          authorRole: ROLES.DATASET_SUPPLIER,
          body: 'Do you want retail panel data limited to the U.S., or should I include comparable international markets I have access to?',
          timestamp: '2026-09-10 16:18',
        },
        {
          id: 'Q-12',
          author: 'Grace Kim',
          authorRole: ROLES.CA,
          body: 'U.S. only for this mission, please — the Candidate is scoped to U.S. consumers.',
          timestamp: '2026-09-10 17:02',
        },
      ],
    },
  ],
}

export const submissionStatusForMember = {
  // Canonical member-facing vocabulary (Section 6): Submitted, Under Review, Advanced, Parked, Not Selected
  'CT-1001': 'Under Review',
  'CT-1002': 'Under Review',
  'CT-1003': 'Under Review',
  'CT-1004': 'Under Review',
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

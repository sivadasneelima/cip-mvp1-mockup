# Community Intelligence Platform — MVP 1 UX Mockup

A click-through, mock-data-only prototype of the Biovergence Community Intelligence
Platform (CIP), based on PDD v1.4. Built with React 18 + Vite + Tailwind CSS, matching
the tech-stack direction in PDD Section 8 (frontend only — there is no backend, database,
or auth here; everything resets on page reload).

This is meant to give the client a concrete feel for the dashboards and screens described
in the PDD, and to ground discussion of the open questions in Section 10 before real
engineering begins. It is **not** a build of the real system.

## What's included

- **Community member dashboard** (Section 4.1) — pending/in-progress missions by role,
  completed submissions with your own contribution's disposition, community description.
- **Scout screen** — Ideation Mission prompt + multi-candidate hypothesis submission form
  (Section 4.2), with a live list of your own submitted Candidates.
- **Validator / Predictor / Dataset Supplier screens** — Candidate-scoped assessment,
  forecast, and dataset submission forms (Sections 4.3–4.5), including the exact
  three-value Validator recommendation vocabulary from Section 1.4/4.3.
- **Clarifying-question (Q&A) threads** — lightweight, mission- and role-scoped, per the
  Section 4.6 option 2 recommendation.
- **BioV Admin console** — mission/candidate list, Ideation-mission triage (shortlist /
  suspend / create Validation Mission), and the kill-gate evaluation & determination
  screen (Sections 3.4, 5.6) showing per-option response tallies against configured
  thresholds with **no computed pass/fail** — the Admin always makes the call.
- **Community Ambassador console** — roster, invitation, and reminder UI (Section 4.7).
- A **"Preview as role" switcher** in the top bar — a prototype-only control (not part of
  the real product) that lets one person click through every role's experience without
  needing six logins.

## Known simplifications (for a first-pass mockup)

- No authentication, magic links, or real invitations — the role switcher stands in for
  login.
- No merge-duplicate-candidates UI, no per-role form-builder/archetype configuration UI,
  and no file uploads actually persist — these are flagged inline as demo omissions.
- State only lives in memory (React context) for the current browser tab/session.
- Styling uses a neutral placeholder palette — swap `tailwind.config.js` colors for the
  real Biovergence brand palette once available.

## Running locally

```bash
npm install
npm run dev
```

Then open the printed local URL (typically http://localhost:5173).

## Deploying to Vercel

**Option A — via GitHub (recommended, no CLI needed):**

1. Push this folder to a new GitHub repository.
2. Go to [vercel.com/new](https://vercel.com/new), import that repository.
3. Vercel auto-detects Vite — leave the default build command (`npm run build`) and
   output directory (`dist`). Click **Deploy**.
4. You'll get a live `*.vercel.app` URL to share with the client.

**Option B — via Vercel CLI:**

```bash
npm install -g vercel
vercel login
vercel        # first deploy, follow the prompts
vercel --prod # promote to your production URL
```

No environment variables or backend services are required — this is a fully static
build.

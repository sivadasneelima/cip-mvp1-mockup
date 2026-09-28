// Deadlines are stored as calendar dates (YYYY-MM-DD) and evaluated against
// the REAL current date every time a screen renders — never against a
// number baked into the seed data at build time. A static `daysLeft: 5`
// field would still read "5 days left" a week later regardless of the
// actual date, which is exactly the bug this file exists to avoid.

export function daysUntil(dateStr) {
  if (!dateStr) return null
  const deadline = new Date(`${dateStr}T23:59:59`)
  const now = new Date()
  return Math.ceil((deadline.getTime() - now.getTime()) / 86400000)
}

// A mission only accepts submissions while its own status says Active AND
// its deadline hasn't passed — PDD 4.8: "on expiry, outstanding submissions
// become Expired ... without an explicit Admin action." This mockup has no
// real clock-driven job to flip the stored status at midnight, so it
// computes the same effect at read time instead.
export function isMissionOpen(mission) {
  if (!mission) return false
  if (mission.status !== 'Active') return false
  const d = daysUntil(mission.deadline)
  return d === null || d > 0
}

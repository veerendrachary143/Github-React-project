const METRIC_FIELDS = {
  commits: 'c',
  additions: 'a',
  deletions: 'd',
}

const HTML_ENTITIES = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
}

export function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (character) => HTML_ENTITIES[character])
}

function sumContributorWeek(contributors, timestamp, field) {
  return contributors.reduce((sum, contributor) => {
    const week = contributor.weeks?.find((entry) => entry.w === timestamp)
    return sum + (week?.[field] || 0)
  }, 0)
}

export function buildActivitySeries({ metric, codeFrequency, commitActivity, contributorActivity }) {
  const field = METRIC_FIELDS[metric]
  const totalByWeek = new Map()

  if (metric === 'commits') {
    commitActivity.forEach((week) => totalByWeek.set(week.week, week.total || 0))
  } else {
    codeFrequency.forEach((week) => {
      totalByWeek.set(week[0], metric === 'additions' ? Math.max(0, week[1]) : Math.abs(Math.min(0, week[2])))
    })
  }

  const contributorSeries = contributorActivity.map((contributor) => ({
    name: contributor.author?.login || contributor.author?.name || 'Unknown contributor',
    points: new Map((contributor.weeks || []).map((week) => [week.w, week[field] || 0])),
  }))
  const dates = new Set(totalByWeek.keys())
  contributorSeries.forEach(({ points }) => points.forEach((_, date) => dates.add(date)))
  const weeks = [...dates].sort((left, right) => left - right)

  const contributors = contributorSeries.map(({ name, points }) => ({
    name,
    data: weeks.map((week) => [week * 1000, points.get(week) || 0]),
  }))
  const total = weeks.map((week) => [
    week * 1000,
    totalByWeek.has(week) ? totalByWeek.get(week) : sumContributorWeek(contributorActivity, week, field),
  ])

  return { weeks, total, contributors }
}

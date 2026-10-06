export const TIME_RANGES = [
  { value: 'week', label: '1 week' },
  { value: 'twoWeeks', label: '2 weeks' },
  { value: 'month', label: '1 month' },
]

export function getCreatedSince(timeRange, now = new Date()) {
  const cutoff = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  if (timeRange === 'week') cutoff.setDate(cutoff.getDate() - 7)
  if (timeRange === 'twoWeeks') cutoff.setDate(cutoff.getDate() - 14)
  if (timeRange === 'month') {
    const dayOfMonth = cutoff.getDate()
    cutoff.setDate(1)
    cutoff.setMonth(cutoff.getMonth() - 1)
    const lastDayOfPreviousMonth = new Date(cutoff.getFullYear(), cutoff.getMonth() + 1, 0).getDate()
    cutoff.setDate(Math.min(dayOfMonth, lastDayOfPreviousMonth))
  }
  return [cutoff.getFullYear(), String(cutoff.getMonth() + 1).padStart(2, '0'), String(cutoff.getDate()).padStart(2, '0')].join('-')
}

export function formatDate(value) {
  if (!value) return 'Unknown'
  return new Intl.DateTimeFormat(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(new Date(value))
}

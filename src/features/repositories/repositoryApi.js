import { getCreatedSince } from '../../utils/dateUtils'

const API_BASE_URL = 'https://api.github.com'
const PAGE_SIZE = 30

// GitHub may need significant time to calculate repository statistics.
const STATISTICS_RETRIES = 2
const STATISTICS_ENDPOINTS = {
  codeFrequency: 'code_frequency',
  commitActivity: 'commit_activity',
  contributorActivity: 'contributors',
}

function getRequestHeaders() {
  const token = import.meta.env.VITE_GITHUB_TOKEN

  return {
    Accept: 'application/vnd.github+json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  }
}

async function getErrorMessage(response) {
  const responseBody = await response.json().catch(() => null)

  const message = responseBody?.message || ''
  const remaining = response.headers.get('x-ratelimit-remaining')

  const isRateLimited =
    response.status === 429 ||
    (
      response.status === 403 &&
      (
        remaining === '0' ||
        message.toLowerCase().includes('rate limit exceeded')
      )
    )

  if (isRateLimited) {
    const reset = Number(response.headers.get('x-ratelimit-reset'))

    const resetText = reset
      ? ` The limit resets at ${new Intl.DateTimeFormat(undefined, {
          hour: 'numeric',
          minute: '2-digit',
        }).format(new Date(reset * 1000))}.`
      : ''

    return `GitHub API rate limit exceeded.${resetText}`
  }

  return message || `GitHub request failed (${response.status})`
}

async function fetchJson(url) {
  const response = await fetch(url, {
    headers: getRequestHeaders(),
  })

  if (!response.ok) {
    throw new Error(await getErrorMessage(response))
  }

  return response.json()
}

/*
 * Fetch repositories from GitHub Search API.
 */
export async function fetchRepositories({ timeRange, page }) {
  const params = new URLSearchParams({
    q: `created:>=${getCreatedSince(timeRange)}`,
    sort: 'stars',
    order: 'desc',
    per_page: String(PAGE_SIZE),
    page: String(page),
  })

  const url = `${API_BASE_URL}/search/repositories?${params}`

  const result = await fetchJson(url)

  return {
    items: result.items || [],
    totalCount: result.total_count || 0,
    page,
    pageSize: PAGE_SIZE,
  }
}

/*
 * GitHub repository statistics endpoints can return 202.
 *
 * 202 means GitHub is still calculating the statistics.
 * We retry with increasing delays.
 */
async function fetchStatistics(url) {
  for (let attempt = 0; attempt <= STATISTICS_RETRIES; attempt += 1) {
    const response = await fetch(`${API_BASE_URL}${url}`, {
      headers: getRequestHeaders(),
    })

    /*
     * GitHub is still calculating the statistics.
     */
    if (response.status === 202) {
      if (attempt === STATISTICS_RETRIES) {
        return { pending: true }
      }

      /*
      * Retry briefly, then return pending so other ready statistics can render.
       */
      const delay = 1000 * (2 ** attempt)

      await new Promise((resolve) => {
        setTimeout(resolve, delay)
      })

      continue
    }

    /*
     * Other API errors.
     */
    if (!response.ok) {
      throw new Error(await getErrorMessage(response))
    }

    return { data: await response.json() }
  }

  return []
}

/*
 * Fetch all activity statistics for one repository.
 */
export async function fetchRepositoryStatistics(repository, endpointNames = Object.keys(STATISTICS_ENDPOINTS)) {
  const owner = repository?.owner?.login
  const repoName = repository?.name

  if (!owner || !repoName) {
    throw new Error('Invalid repository information.')
  }

  const basePath = `/repos/${owner}/${repoName}/stats`
  const requestedEndpoints = endpointNames.filter((name) => STATISTICS_ENDPOINTS[name])
  const results = await Promise.all(requestedEndpoints.map(async (name) => {
    try {
      const result = await fetchStatistics(`${basePath}/${STATISTICS_ENDPOINTS[name]}`)
      return { name, ...result }
    } catch (error) {
      return { name, error: error.message || 'Unable to load this statistic.' }
    }
  }))

  return results.reduce((statistics, result) => {
    if (result.pending) {
      statistics.pendingStatistics.push(result.name)
    } else if (result.error) {
      statistics.statisticsErrors[result.name] = result.error
    } else {
      statistics[result.name] = Array.isArray(result.data) ? result.data : []
    }
    return statistics
  }, { pendingStatistics: [], statisticsErrors: {} })
}
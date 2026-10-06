import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  repositories: [],
  selectedRepository: null,
  selectedTimeRange: 'week',
  currentPage: 1,
  hasMore: true,
  loading: false,
  loadingMore: false,
  activityLoading: false,
  error: null,
  activityError: null,
  selectedMetric: 'commits',
  codeFrequency: [],
  commitActivity: [],
  contributorActivity: [],
  pendingStatistics: [],
  statisticsErrors: {},
  activityByRepository: {},
}

const repositorySlice = createSlice({
  name: 'repositories',
  initialState,
  reducers: {
    fetchRepositoriesRequested(state, action) {
      const reset = action.payload?.reset ?? false
      state.loading = reset
      state.error = null
      if (reset) {
        state.repositories = []
        state.currentPage = 1
        state.hasMore = true
      }
    },
    fetchRepositoriesSucceeded(state, action) {
      const { items, page, pageSize, totalCount, reset } = action.payload
      state.repositories = reset ? items : [...state.repositories, ...items]
      state.currentPage = page
      state.loading = false
      state.loadingMore = false
      state.hasMore = items.length === pageSize && page * pageSize < Math.min(totalCount, 1000)
    },
    fetchRepositoriesFailed(state, action) {
      state.loading = false
      state.loadingMore = false
      state.error = action.payload
    },
    loadMoreRequested() {},
    fetchMoreRequested(state) {
      state.loadingMore = true
      state.error = null
    },
    setTimeRange(state, action) {
      state.selectedTimeRange = action.payload
      state.repositories = []
      state.currentPage = 1
      state.hasMore = true
      state.loading = true
      state.loadingMore = false
      state.error = null
    },
    selectRepository(state, action) {
      const repository = action.payload
      const isSameRepository = state.selectedRepository?.full_name === repository?.full_name
      state.selectedRepository = isSameRepository ? null : repository
      state.activityError = null
      if (!state.selectedRepository) {
        state.activityLoading = false
        state.codeFrequency = []
        state.commitActivity = []
        state.contributorActivity = []
        state.pendingStatistics = []
        state.statisticsErrors = {}
        return
      }
      const cached = state.activityByRepository[state.selectedRepository.full_name]
      state.codeFrequency = cached?.codeFrequency || []
      state.commitActivity = cached?.commitActivity || []
      state.contributorActivity = cached?.contributorActivity || []
      state.pendingStatistics = cached?.pendingStatistics || []
      state.statisticsErrors = cached?.statisticsErrors || {}
      const hasCachedActivity = state.codeFrequency.length > 0
        || state.commitActivity.length > 0
        || state.contributorActivity.length > 0
      state.activityLoading = !hasCachedActivity
        && cached?.status !== 'succeeded'
        && cached?.status !== 'failed'
      state.activityError = cached?.error || null
    },
    activityRequested(state, action) {
      const key = action.payload.full_name
      state.activityByRepository[key] = {
        ...state.activityByRepository[key],
        status: 'loading',
        error: null,
      }
      if (state.selectedRepository?.full_name === key) {
        state.activityLoading = state.codeFrequency.length === 0
          && state.commitActivity.length === 0
          && state.contributorActivity.length === 0
        state.activityError = null
      }
    },
    activitySucceeded(state, action) {
      const { fullName, pendingStatistics, statisticsErrors, ...statistics } = action.payload
      const previous = state.activityByRepository[fullName] || {}
      const activity = {
        ...previous,
        ...statistics,
        pendingStatistics,
        statisticsErrors,
        status: pendingStatistics.length || Object.keys(statisticsErrors).length ? 'partial' : 'succeeded',
        error: null,
      }
      state.activityByRepository[fullName] = activity
      if (state.selectedRepository?.full_name === fullName) {
        state.activityLoading = false
        state.activityError = null
        state.codeFrequency = activity.codeFrequency || []
        state.commitActivity = activity.commitActivity || []
        state.contributorActivity = activity.contributorActivity || []
        state.pendingStatistics = pendingStatistics
        state.statisticsErrors = statisticsErrors
      }
    },
    activityFailed(state, action) {
      const { fullName, error } = action.payload
      state.activityByRepository[fullName] = {
        ...state.activityByRepository[fullName],
        status: 'failed',
        error,
      }
      if (state.selectedRepository?.full_name === fullName) {
        state.activityLoading = false
        state.activityError = error
      }
    },
    retryActivity(state) {
      state.activityError = null
      state.activityLoading = state.codeFrequency.length === 0
        && state.commitActivity.length === 0
        && state.contributorActivity.length === 0
    },
    setSelectedMetric(state, action) {
      state.selectedMetric = action.payload
    },
  },
})

export const {
  fetchRepositoriesRequested,
  fetchRepositoriesSucceeded,
  fetchRepositoriesFailed,
  loadMoreRequested,
  fetchMoreRequested,
  setTimeRange,
  selectRepository,
  activityRequested,
  activitySucceeded,
  activityFailed,
  retryActivity,
  setSelectedMetric,
} = repositorySlice.actions

export default repositorySlice.reducer

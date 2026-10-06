import { call, delay, fork, put, select, takeEvery, takeLatest, takeLeading } from 'redux-saga/effects'
import {
  activityFailed,
  activityRequested,
  activitySucceeded,
  fetchMoreRequested,
  fetchRepositoriesFailed,
  fetchRepositoriesRequested,
  fetchRepositoriesSucceeded,
  loadMoreRequested,
  retryActivity,
  selectRepository,
  setTimeRange,
} from './repositorySlice'
import { fetchRepositories, fetchRepositoryStatistics } from './repositoryApi'

function* loadRepositories(action) {
  const reset = action.payload?.reset ?? false
  try {
    const timeRange = yield select((state) => state.repositories.selectedTimeRange)
    const page = reset ? 1 : action.payload?.page || 1
    const result = yield call(fetchRepositories, { timeRange, page })
    yield put(fetchRepositoriesSucceeded({ ...result, reset }))
  } catch (error) {
    yield put(fetchRepositoriesFailed(error.message || 'Unable to load repositories.'))
  }
}

function* loadMoreRepositories() {
  const { loading, loadingMore, hasMore, currentPage } = yield select((state) => state.repositories)
  if (loading || loadingMore || !hasMore) return
  try {
    const timeRange = yield select((state) => state.repositories.selectedTimeRange)
    const page = currentPage + 1
    yield put(fetchMoreRequested())
    const result = yield call(fetchRepositories, { timeRange, page })
    yield put(fetchRepositoriesSucceeded({ ...result, reset: false }))
  } catch (error) {
    yield put(fetchRepositoriesFailed(error.message || 'Unable to load more repositories.'))
  }
}

function* loadRepositoryActivity(action) {
  const selectedRepository = yield select((state) => state.repositories.selectedRepository)
  const repository = action.type === retryActivity.type
    ? selectedRepository
    : selectedRepository?.full_name === action.payload?.full_name
      ? selectedRepository
      : null
  if (!repository) return
  const key = repository.full_name
  const existing = yield select((state) => state.repositories.activityByRepository[key])
  if (existing?.status === 'succeeded' || existing?.status === 'loading') return
  const endpointNames = existing?.status === 'partial'
    ? [...new Set([
      ...(existing.pendingStatistics || []),
      ...Object.keys(existing.statisticsErrors || {}),
    ])]
    : undefined
  yield put(activityRequested(repository))
  try {
    const statistics = yield call(fetchRepositoryStatistics, repository, endpointNames)
    yield put(activitySucceeded({ fullName: key, ...statistics }))
  } catch (error) {
    yield put(activityFailed({ fullName: key, error: error.message || 'Unable to load repository statistics.' }))
  }
}

function* watchTimeRange() {
  yield takeLatest(setTimeRange.type, function* fetchForRange() {
    yield delay(100)
    yield put(fetchRepositoriesRequested({ reset: true }))
  })
}

export default function* repositorySaga() {
  yield takeLatest(fetchRepositoriesRequested.type, loadRepositories)
  yield takeLeading(loadMoreRequested.type, loadMoreRepositories)
  yield takeEvery([selectRepository.type, retryActivity.type], loadRepositoryActivity)
  yield fork(watchTimeRange)
}

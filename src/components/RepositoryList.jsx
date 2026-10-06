import { useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Alert, Box, Button, CircularProgress, Stack, Typography } from '@mui/material'
import RefreshRoundedIcon from '@mui/icons-material/RefreshRounded'
import { fetchRepositoriesRequested, loadMoreRequested } from '../features/repositories/repositorySlice'
import { selectRepositories } from '../features/repositories/repositorySelectors'
import LoadingState from './LoadingState'
import RepositoryCard from './RepositoryCard'

function RepositoryList() {
  const dispatch = useDispatch()
  const repositories = useSelector(selectRepositories)
  const loading = useSelector((state) => state.repositories.loading)
  const loadingMore = useSelector((state) => state.repositories.loadingMore)
  const hasMore = useSelector((state) => state.repositories.hasMore)
  const error = useSelector((state) => state.repositories.error)
  const currentPage = useSelector((state) => state.repositories.currentPage)
  const sentinelRef = useRef(null)

  useEffect(() => {
    const sentinel = sentinelRef.current
    if (!sentinel || !hasMore || loading || loadingMore || error) return undefined

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) dispatch(loadMoreRequested())
    }, { rootMargin: '400px 0px' })

    observer.observe(sentinel)
    return () => observer.disconnect()
  }, [dispatch, error, hasMore, loading, loadingMore, repositories.length])

  if (loading && repositories.length === 0) return <LoadingState />
  if (error && repositories.length === 0) {
    return (
      <Alert
        severity="error"
        action={<Button color="inherit" startIcon={<RefreshRoundedIcon />} onClick={() => dispatch(fetchRepositoriesRequested({ reset: true }))}>Retry</Button>}
      >
        {error}
      </Alert>
    )
  }
  if (!loading && repositories.length === 0) {
    return (
      <Box sx={{ py: 8, textAlign: 'center' }}>
        <Typography variant="h2" sx={{ mb: 1 }}>No repositories found</Typography>
        <Typography color="text.secondary">Try a wider time range to discover more repositories.</Typography>
      </Box>
    )
  }

  return (
    <>
      {error && (
        <Alert severity="warning" sx={{ mb: 1.5 }} action={
          <Button color="inherit" onClick={() => dispatch(loadMoreRequested())}>Retry</Button>
        }>
          {error}
        </Alert>
      )}
      <Stack className="repository-list">
        {repositories.map((repository) => <RepositoryCard key={repository.id} repository={repository} />)}
      </Stack>
      <Box ref={sentinelRef} className="infinite-sentinel" aria-hidden="true" />
      {loadingMore && (
        <Stack direction="row" spacing={1} sx={{ alignItems: 'center', justifyContent: 'center', py: 3 }}>
          <CircularProgress size={18} />
          <Typography variant="body2" color="text.secondary">Loading more repositories</Typography>
        </Stack>
      )}
      {!hasMore && repositories.length > 0 && (
        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', textAlign: 'center', py: 3 }}>
          Showing {repositories.length} of {Math.min(currentPage * 30, 1000)} available results
        </Typography>
      )}
    </>
  )
}

export default RepositoryList

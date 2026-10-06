import { lazy, Suspense } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Alert, Box, Button, Card, CardContent, CircularProgress, Divider, Stack, Typography } from '@mui/material'
import RefreshRoundedIcon from '@mui/icons-material/RefreshRounded'
import { retryActivity, setSelectedMetric } from '../features/repositories/repositorySlice'
import { selectActivityChartData } from '../features/repositories/repositorySelectors'
import MetricSelector from './MetricSelector'

const TotalChangesChart = lazy(() => import('./TotalChangesChart'))
const ContributorChangesChart = lazy(() => import('./ContributorChangesChart'))

const METRIC_LABELS = { commits: 'commits', additions: 'additions', deletions: 'deletions' }
const STATISTIC_LABELS = {
  codeFrequency: 'code changes',
  commitActivity: 'commit activity',
  contributorActivity: 'contributors',
}

function RepositoryActivity() {
  const dispatch = useDispatch()
  const activityLoading = useSelector((state) => state.repositories.activityLoading)
  const activityError = useSelector((state) => state.repositories.activityError)
  const pendingStatistics = useSelector((state) => state.repositories.pendingStatistics)
  const statisticsErrors = useSelector((state) => state.repositories.statisticsErrors)
  const selectedMetric = useSelector((state) => state.repositories.selectedMetric)
  const { total, contributors } = useSelector(selectActivityChartData)
  const metric = METRIC_LABELS[selectedMetric]
  const hasChartData = total.length > 0 || contributors.length > 0
  const endpointErrors = Object.keys(statisticsErrors)
  const statusMessage = [
    pendingStatistics.length > 0
      ? `GitHub is still calculating ${pendingStatistics.map((name) => STATISTIC_LABELS[name]).join(' and ')}. Available charts remain visible; retry to check again, or select an older repository.`
      : null,
    endpointErrors.length > 0
      ? `Could not load ${endpointErrors.map((name) => STATISTIC_LABELS[name]).join(' and ')}: ${endpointErrors.map((name) => statisticsErrors[name]).join(' ')}.`
      : null,
  ].filter(Boolean).join(' ')

  return (
    <Box sx={{ p: { xs: 1.75, sm: 2.5 }, bgcolor: '#fbfcfb' }}>
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        spacing={1.5}
        sx={{ alignItems: { xs: 'stretch', sm: 'center' }, justifyContent: 'space-between' }}
      >
        <Box>
          <Typography variant="h2">Repository activity</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.35 }}>
            Weekly {metric} across the selected repository
          </Typography>
        </Box>
        <MetricSelector value={selectedMetric} onChange={(value) => dispatch(setSelectedMetric(value))} />
      </Stack>
      {(activityError || statusMessage) && (
        <Alert
          severity={activityError || endpointErrors.length > 0 ? 'error' : 'info'}
          sx={{ mt: 2 }}
          action={<Button color="inherit" startIcon={<RefreshRoundedIcon />} onClick={() => dispatch(retryActivity())}>Retry</Button>}
        >
          {activityError || statusMessage}
        </Alert>
      )}
      {activityLoading ? (
        <Stack spacing={1} sx={{ alignItems: 'center', py: 7 }}>
          <CircularProgress size={26} />
          <Typography variant="body2" color="text.secondary">
            GitHub may take a little time to calculate these statistics
          </Typography>
        </Stack>
      ) : !hasChartData ? (
        <Alert severity="info" sx={{ mt: 2 }}>No weekly activity data is available for this repository yet.</Alert>
      ) : (
        <Box className="chart-grid">
          <Card variant="outlined">
            <CardContent sx={{ pb: '10px !important' }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>Total weekly {metric}</Typography>
              <Typography variant="caption" color="text.secondary">All contributors combined</Typography>
              <Box className="chart-container">
                <Suspense fallback={<CircularProgress size={20} sx={{ m: 4 }} />}>
                  <TotalChangesChart data={total} metric={metric} />
                </Suspense>
              </Box>
            </CardContent>
          </Card>
          <Card variant="outlined">
            <CardContent sx={{ pb: '10px !important' }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>Weekly {metric} by contributor</Typography>
              <Typography variant="caption" color="text.secondary">Select a contributor in the legend to toggle their line</Typography>
              <Divider sx={{ mt: 1 }} />
              {contributors.length > 0 ? (
                <Box className="chart-container">
                  <Suspense fallback={<CircularProgress size={20} sx={{ m: 4 }} />}>
                    <ContributorChangesChart series={contributors} metric={metric} />
                  </Suspense>
                </Box>
              ) : (
                <Typography variant="body2" color="text.secondary" sx={{ py: 5, textAlign: 'center' }}>
                  Contributor-level activity is not available.
                </Typography>
              )}
            </CardContent>
          </Card>
        </Box>
      )}
    </Box>
  )
}

export default RepositoryActivity

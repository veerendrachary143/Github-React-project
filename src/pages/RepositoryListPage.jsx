import { useDispatch, useSelector } from 'react-redux'
import { Box, Stack, Typography } from '@mui/material'
import Header from '../components/Header'
import TimeRangeSelector from '../components/TimeRangeSelector'
import RepositoryList from '../components/RepositoryList'
import { setTimeRange } from '../features/repositories/repositorySlice'
import { TIME_RANGES } from '../utils/dateUtils'
import '../App.css'

function RepositoryListPage() {
  const dispatch = useDispatch()
  const selectedTimeRange = useSelector((state) => state.repositories.selectedTimeRange)
  const repositories = useSelector((state) => state.repositories.repositories)
  const loading = useSelector((state) => state.repositories.loading)
  const selectedLabel = TIME_RANGES.find((range) => range.value === selectedTimeRange)?.label

  return (
    <Box className="app-shell">
      <Header />
      <Box component="main" className="page-content">
        <Stack className="page-heading">
          <Box>
            <Typography className="page-kicker">Explore open source</Typography>
            <Typography component="h1" variant="h1" sx={{ mt: 0.6 }}>Repository analytics</Typography>
            <Typography color="text.secondary" sx={{ mt: 0.8 }}>
              Find new projects and inspect the activity behind them.
            </Typography>
          </Box>
          <TimeRangeSelector value={selectedTimeRange} onChange={(range) => dispatch(setTimeRange(range))} />
        </Stack>
        <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'space-between', mb: 1.5 }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>Recently created repositories</Typography>
          <Typography variant="caption" color="text.secondary">
            {loading && repositories.length === 0 ? 'Loading results' : `${repositories.length} loaded · ${selectedLabel}`}
          </Typography>
        </Stack>
        <RepositoryList />
      </Box>
    </Box>
  )
}

export default RepositoryListPage

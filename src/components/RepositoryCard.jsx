import { useDispatch, useSelector } from 'react-redux'
import { Avatar, Box, Card, CardActionArea, Chip, Divider, Stack, Typography } from '@mui/material'
import StarRoundedIcon from '@mui/icons-material/StarRounded'
import BugReportOutlinedIcon from '@mui/icons-material/BugReportOutlined'
import OpenInNewRoundedIcon from '@mui/icons-material/OpenInNewRounded'
import { selectRepository } from '../features/repositories/repositorySlice'
import { formatDate } from '../utils/dateUtils'
import RepositoryDetailsPage from '../pages/RepositoryDetailsPage'

function compactNumber(value) {
  return new Intl.NumberFormat(undefined, { notation: 'compact', maximumFractionDigits: 1 }).format(value || 0)
}

function RepositoryCard({ repository }) {
  const dispatch = useDispatch()
  const selectedRepository = useSelector((state) => state.repositories.selectedRepository)
  const selected = selectedRepository?.full_name === repository.full_name

  return (
    <Card className={`repository-card${selected ? ' is-selected' : ''}`} variant="outlined">
      <CardActionArea
        onClick={() => dispatch(selectRepository(repository))}
        aria-expanded={selected}
        aria-label={`${selected ? 'Close' : 'View'} activity for ${repository.full_name}`}
        sx={{ p: { xs: 1.75, sm: 2.25 } }}
      >
        <Stack direction="row" spacing={1.75} sx={{ alignItems: 'flex-start' }}>
          <Avatar src={repository.owner.avatar_url} alt={`${repository.owner.login} avatar`} sx={{ width: 42, height: 42, flexShrink: 0 }} />
          <Box sx={{ minWidth: 0, flex: 1, textAlign: 'left' }}>
            <Stack direction="row" spacing={0.75} sx={{ alignItems: 'center', minWidth: 0 }}>
              <Typography component="h2" variant="subtitle1" noWrap sx={{ color: 'primary.dark', fontWeight: 700 }}>
                {repository.full_name}
              </Typography>
              <OpenInNewRoundedIcon sx={{ color: 'text.disabled', fontSize: 15, flexShrink: 0 }} />
            </Stack>
            <Typography className="repository-description" variant="body2" color="text.secondary" sx={{ mt: 0.25, maxWidth: 740 }}>
              {repository.description || 'No description provided.'}
            </Typography>
            <Stack direction="row" spacing={1.75} useFlexGap sx={{ alignItems: 'center', flexWrap: 'wrap', mt: 1.3 }}>
              <Typography variant="caption" color="text.secondary">by <b>{repository.owner.login}</b></Typography>
              <Stack direction="row" spacing={0.4} sx={{ alignItems: 'center' }}>
                <StarRoundedIcon sx={{ fontSize: 16, color: '#c18a1b' }} />
                <Typography variant="caption">{compactNumber(repository.stargazers_count)} stars</Typography>
              </Stack>
              <Stack direction="row" spacing={0.4} sx={{ alignItems: 'center' }}>
                <BugReportOutlinedIcon sx={{ fontSize: 15, color: 'text.secondary' }} />
                <Typography variant="caption" color="text.secondary">{compactNumber(repository.open_issues_count)} issues</Typography>
              </Stack>
              <Typography variant="caption" color="text.secondary">
                Pushed {formatDate(repository.pushed_at)}
              </Typography>
            </Stack>
          </Box>
          <Chip size="small" label={selected ? 'Close' : 'Activity'} color={selected ? 'primary' : 'default'} variant={selected ? 'filled' : 'outlined'} sx={{ display: { xs: 'none', sm: 'inline-flex' }, alignSelf: 'center' }} />
        </Stack>
      </CardActionArea>
      {selected && (
        <>
          <Divider />
          <RepositoryDetailsPage repository={repository} />
        </>
      )}
    </Card>
  )
}

export default RepositoryCard

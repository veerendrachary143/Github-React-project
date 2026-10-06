import { Box, Card, CardContent, Skeleton, Stack } from '@mui/material'

function LoadingState({ count = 5 }) {
  return (
    <Stack spacing={1.25} aria-label="Loading repositories">
      {Array.from({ length: count }, (_, index) => (
        <Card key={index} variant="outlined">
          <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2, p: '18px !important' }}>
            <Skeleton variant="circular" width={42} height={42} />
            <Box sx={{ flex: 1 }}>
              <Skeleton width="34%" height={24} />
              <Skeleton width="76%" height={20} />
              <Skeleton width="55%" height={18} />
            </Box>
          </CardContent>
        </Card>
      ))}
    </Stack>
  )
}

export default LoadingState

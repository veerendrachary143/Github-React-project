import { AppBar, Box, Stack, Toolbar, Typography } from '@mui/material'
import InsightsRoundedIcon from '@mui/icons-material/InsightsRounded'

function Header() {
  return (
    <AppBar position="static" color="inherit" elevation={0}>
      <Toolbar sx={{ width: 'min(1120px, calc(100% - 48px))', mx: 'auto', px: '0 !important', minHeight: '68px !important' }}>
        <Stack direction="row" spacing={1.25} sx={{ alignItems: 'center' }}>
          <Box sx={{ display: 'grid', placeItems: 'center', width: 34, height: 34, borderRadius: 1.5, bgcolor: 'primary.main', color: 'white' }}>
            <InsightsRoundedIcon fontSize="small" />
          </Box>
          <Typography variant="subtitle1" sx={{ fontWeight: 700, letterSpacing: 0 }}>
            RepoScope
          </Typography>
        </Stack>
        <Box sx={{ flexGrow: 1 }} />
        <Typography variant="body2" color="text.secondary" sx={{ display: { xs: 'none', sm: 'block' } }}>
          GitHub repository analytics
        </Typography>
      </Toolbar>
    </AppBar>
  )
}

export default Header

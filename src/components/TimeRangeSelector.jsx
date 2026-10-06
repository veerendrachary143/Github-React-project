import { ToggleButton, ToggleButtonGroup } from '@mui/material'
import { TIME_RANGES } from '../utils/dateUtils'

function TimeRangeSelector({ value, onChange }) {
  return (
    <ToggleButtonGroup
      exclusive
      size="small"
      value={value}
      aria-label="Repository creation time range"
      onChange={(_, nextValue) => nextValue && onChange(nextValue)}
      sx={{ bgcolor: 'background.paper', '& .MuiToggleButton-root': { px: 1.5, py: 0.8, borderColor: 'divider' } }}
    >
      {TIME_RANGES.map((range) => (
        <ToggleButton key={range.value} value={range.value} aria-label={`Created in the last ${range.label}`}>
          {range.label}
        </ToggleButton>
      ))}
    </ToggleButtonGroup>
  )
}

export default TimeRangeSelector

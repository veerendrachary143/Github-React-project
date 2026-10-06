import { FormControl, InputLabel, MenuItem, Select } from '@mui/material'

const METRICS = [
  { value: 'commits', label: 'Commits' },
  { value: 'additions', label: 'Additions' },
  { value: 'deletions', label: 'Deletions' },
]

function MetricSelector({ value, onChange }) {
  return (
    <FormControl size="small" sx={{ minWidth: 150 }}>
      <InputLabel id="metric-selector-label">Activity metric</InputLabel>
      <Select
        labelId="metric-selector-label"
        value={value}
        label="Activity metric"
        onChange={(event) => onChange(event.target.value)}
      >
        {METRICS.map((metric) => (
          <MenuItem key={metric.value} value={metric.value}>{metric.label}</MenuItem>
        ))}
      </Select>
    </FormControl>
  )
}

export default MetricSelector

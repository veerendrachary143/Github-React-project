import { createSelector } from '@reduxjs/toolkit'
import { buildActivitySeries } from '../../utils/chartUtils'

export const selectRepositories = (state) => state.repositories.repositories

export const selectActivityChartData = createSelector(
  [
    (state) => state.repositories.selectedMetric,
    (state) => state.repositories.codeFrequency,
    (state) => state.repositories.commitActivity,
    (state) => state.repositories.contributorActivity,
  ],
  (metric, codeFrequency, commitActivity, contributorActivity) => buildActivitySeries({
    metric,
    codeFrequency,
    commitActivity,
    contributorActivity,
  }),
)

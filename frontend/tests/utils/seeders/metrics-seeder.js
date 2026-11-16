import { MetricsDto } from '@/apis/metrics/dtos/metrics-dto.js'

const getMetricApi = (overrides = {}) => ({
  count: 12,
  total: 48,
  ...overrides,
})

const getMetricsApi = (overrides = {}) => ({
  period: {
    days: 30,
    from: '2026-10-16T10:00:00+00:00',
    to: '2026-11-15T10:00:00+00:00',
  },
  metrics: {
    returning_readers: getMetricApi(),
    returning_authors: getMetricApi({ count: 3, total: 9 }),
    continued_continuations: getMetricApi({ count: 7, total: 20 }),
    active_branches: getMetricApi({ count: 4, total: 16 }),
    alternate_branch_readers: getMetricApi({ count: 5 }),
    branch_followers: getMetricApi({ count: 6, total: null }),
    completed_readings: getMetricApi({ count: 9, total: 30 }),
    comments: getMetricApi({ count: 21, total: null }),
    likes: getMetricApi({ count: 64, total: null }),
    inactive_continuations: getMetricApi({ count: 2, total: 0 }),
  },
  inactive_after_days: 30,
  ...overrides,
})

const getMetrics = (overrides = {}) => ({ ...MetricsDto.fromShow(getMetricsApi()), ...overrides })

export const metricsSeeder = {
  getMetricApi,
  getMetrics,
  getMetricsApi,
}

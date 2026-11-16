import { describe, it, expect } from 'vitest'
import { MetricsDto } from '@/apis/metrics/dtos/metrics-dto.js'
import { metricsSeeder } from '&/utils/seeders/metrics-seeder.js'

describe('metrics-dto', () => {
  describe('fromMetric', () => {
    it('keeps the count and its total with the rounded rate', () => {
      expect(
        MetricsDto.fromMetric(
          'returning_readers',
          metricsSeeder.getMetricApi({ count: 1, total: 3 }),
        ),
      ).toEqual({
        key: 'returning_readers',
        count: 1,
        total: 3,
        rate: 33,
      })
    })

    it('keeps only the count of a metric without total', () => {
      expect(
        MetricsDto.fromMetric('comments', metricsSeeder.getMetricApi({ count: 21, total: null })),
      ).toEqual({
        key: 'comments',
        count: 21,
      })
    })

    it('leaves out the rate of an empty total instead of dividing by zero', () => {
      expect(
        MetricsDto.fromMetric(
          'inactive_continuations',
          metricsSeeder.getMetricApi({ count: 0, total: 0 }),
        ),
      ).toEqual({
        key: 'inactive_continuations',
        count: 0,
      })
    })
  })
})

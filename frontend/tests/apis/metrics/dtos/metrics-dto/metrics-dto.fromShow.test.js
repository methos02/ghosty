import { describe, it, expect } from 'vitest'
import { MetricsDto } from '@/apis/metrics/dtos/metrics-dto.js'
import { metricsSeeder } from '&/utils/seeders/metrics-seeder.js'

describe('metrics-dto', () => {
  describe('fromShow', () => {
    it('keeps the period length and the inactivity delay', () => {
      const metricsApi = metricsSeeder.getMetricsApi()

      const report = MetricsDto.fromShow(metricsApi)

      expect(report).toMatchObject({
        days: metricsApi.period.days,
        inactiveAfterDays: metricsApi.inactive_after_days,
      })
    })

    it('lists every metric in the order served by the api', () => {
      const metricsApi = metricsSeeder.getMetricsApi()

      const report = MetricsDto.fromShow(metricsApi)

      expect(report.metrics.map(metric => metric.key)).toEqual(Object.keys(metricsApi.metrics))
      expect(report.metrics[0]).toEqual(
        MetricsDto.fromMetric('returning_readers', metricsApi.metrics.returning_readers),
      )
    })
  })
})

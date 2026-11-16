import { describe, it, expect, vi, afterEach } from 'vitest'
import { MetricsController } from '@/apis/metrics/controllers/metrics-controller.js'
import { MetricsRepository } from '@/apis/metrics/repositories/metrics-repository.js'
import { MetricsDto } from '@/apis/metrics/dtos/metrics-dto.js'
import { STATUS } from '@/constants/ajax-constants.js'
import { controllerError, controllerSuccess } from '&/utils/helpers/controller-response.js'
import { metricsSeeder } from '&/utils/seeders/metrics-seeder.js'

describe('metrics-controller', () => {
  afterEach(() => {
    vi.clearAllMocks()
  })

  describe('show', () => {
    it('asks the metrics of the requested period', async () => {
      vi.spyOn(MetricsRepository, 'show').mockResolvedValue(
        controllerSuccess({ data: metricsSeeder.getMetricsApi() }),
      )

      await MetricsController.show(7)

      expect(MetricsRepository.show).toHaveBeenCalledWith({
        params: MetricsDto.toShowParams(7),
      })
    })

    it('returns the report mapped by the dto', async () => {
      const metricsApi = metricsSeeder.getMetricsApi()
      vi.spyOn(MetricsRepository, 'show').mockResolvedValue(controllerSuccess({ data: metricsApi }))

      const result = await MetricsController.show(30)

      expect(result).toEqual({
        status: STATUS.SUCCESS,
        report: MetricsDto.fromShow(metricsApi),
      })
    })

    it('passes a failure through untouched', async () => {
      const failure = controllerError(STATUS.FORBIDDEN)
      vi.spyOn(MetricsRepository, 'show').mockResolvedValue(failure)

      const result = await MetricsController.show(30)

      expect(result).toBe(failure)
    })
  })
})

import { MetricsRepository } from '@/apis/metrics/repositories/metrics-repository.js'
import { MetricsDto } from '@/apis/metrics/dtos/metrics-dto.js'
import { controllerResponseHelper } from '@/core/helpers/controller-response-helper.js'

const show = async days => {
  const response = await MetricsRepository.show({
    params: MetricsDto.toShowParams(days),
  })

  return controllerResponseHelper.buildResponse(response, data => ({
    report: MetricsDto.fromShow(data),
  }))
}

export const MetricsController = {
  show,
}

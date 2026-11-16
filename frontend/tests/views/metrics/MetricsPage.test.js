import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { createHead } from '@unhead/vue/client'
import MetricsPage from '@/views/metrics/MetricsPage.vue'
import { MetricsRepository } from '@/apis/metrics/repositories/metrics-repository.js'
import { MetricsDto } from '@/apis/metrics/dtos/metrics-dto.js'
import { NotificationRepository } from '@/apis/notifications/repositories/notification-repository.js'
import {
  METRICS_DEFAULT_PERIOD,
  METRICS_PERIODS,
  METRICS_KEYS,
} from '@/constants/metrics-constants.js'
import { t } from '@/services/shortcuts/services-shortcut.js'
import { STATUS } from '@/constants/ajax-constants.js'
import { controllerError, controllerSuccess } from '&/utils/helpers/controller-response.js'
import { metricsSeeder } from '&/utils/seeders/metrics-seeder.js'
import { notificationSeeder } from '&/utils/seeders/notification-seeder.js'

describe('MetricsPage.vue', () => {
  let wrapper

  beforeEach(() => {
    vi.spyOn(NotificationRepository, 'list').mockResolvedValue(
      controllerSuccess({ data: notificationSeeder.getListApi() }),
    )
  })

  afterEach(() => {
    wrapper?.unmount()
    wrapper = undefined
    vi.clearAllMocks()
    vi.useRealTimers()
  })

  it('asks the metrics of the default period and shows one card per metric', async () => {
    const metricsApi = metricsSeeder.getMetricsApi()
    vi.spyOn(MetricsRepository, 'show').mockResolvedValue(controllerSuccess({ data: metricsApi }))

    wrapper = mount(MetricsPage, { global: { plugins: [createHead()] } })
    await flushPromises()

    expect(MetricsRepository.show).toHaveBeenCalledWith({
      params: MetricsDto.toShowParams(METRICS_DEFAULT_PERIOD),
    })
    expect(wrapper.findAll('.metric-card')).toHaveLength(Object.keys(metricsApi.metrics).length)
  })

  it('shows skeleton cards while the metrics are loading', async () => {
    vi.spyOn(MetricsRepository, 'show').mockReturnValue(new Promise(() => {}))

    wrapper = mount(MetricsPage, { global: { plugins: [createHead()] } })
    await flushPromises()

    expect(wrapper.findAll('.metric-card-skeleton')).toHaveLength(METRICS_KEYS.length)
    expect(wrapper.find('.metric-card').exists()).toBe(false)
  })

  it('replaces the skeleton cards with the metrics once loaded', async () => {
    vi.spyOn(MetricsRepository, 'show').mockResolvedValue(
      controllerSuccess({ data: metricsSeeder.getMetricsApi() }),
    )

    wrapper = mount(MetricsPage, { global: { plugins: [createHead()] } })
    await flushPromises()

    expect(wrapper.find('.metric-card-skeleton').exists()).toBe(false)
  })

  it('shows the dates covered by the period before the metrics are loaded', async () => {
    vi.useFakeTimers({ toFake: ['Date'] })
    vi.setSystemTime(new Date('2026-11-16T10:00:00'))
    vi.spyOn(MetricsRepository, 'show').mockReturnValue(new Promise(() => {}))

    wrapper = mount(MetricsPage, { global: { plugins: [createHead()] } })
    await flushPromises()

    expect(wrapper.find('.metrics-page__range').text()).toBe(
      t('metrics_page.range', { from: '17/10/2026', to: '16/11/2026' }),
    )
  })

  it('moves the start date to the period picked by the admin', async () => {
    vi.useFakeTimers({ toFake: ['Date'] })
    vi.setSystemTime(new Date('2026-11-16T10:00:00'))
    vi.spyOn(MetricsRepository, 'show').mockReturnValue(new Promise(() => {}))
    wrapper = mount(MetricsPage, { global: { plugins: [createHead()] } })

    await wrapper.findAll('.metrics-page__period')[0].trigger('click')

    expect(wrapper.find('.metrics-page__range').text()).toBe(
      t('metrics_page.range', { from: '09/11/2026', to: '16/11/2026' }),
    )
  })

  it('reloads the metrics over the period picked by the admin', async () => {
    vi.spyOn(MetricsRepository, 'show').mockResolvedValue(
      controllerSuccess({ data: metricsSeeder.getMetricsApi() }),
    )
    wrapper = mount(MetricsPage, { global: { plugins: [createHead()] } })
    await flushPromises()

    await wrapper.findAll('.metrics-page__period')[0].trigger('click')
    await flushPromises()

    expect(MetricsRepository.show).toHaveBeenLastCalledWith({
      params: MetricsDto.toShowParams(METRICS_PERIODS.WEEK),
    })
    expect(wrapper.findAll('.metrics-page__period')[0].classes()).toContain('btn-primary')
  })

  it('shows no card when the metrics cannot be loaded', async () => {
    vi.spyOn(MetricsRepository, 'show').mockResolvedValue(controllerError(STATUS.FORBIDDEN))

    wrapper = mount(MetricsPage, { global: { plugins: [createHead()] } })
    await flushPromises()

    expect(wrapper.find('.metric-card').exists()).toBe(false)
  })
})

import { describe, it, expect, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import MetricCard from '@/views/metrics/parts/MetricCard.vue'
import { MetricsDto } from '@/apis/metrics/dtos/metrics-dto.js'
import { t } from '@/services/shortcuts/services-shortcut.js'
import { metricsSeeder } from '&/utils/seeders/metrics-seeder.js'

describe('MetricCard.vue', () => {
  let wrapper

  afterEach(() => {
    wrapper?.unmount()
    wrapper = undefined
  })

  it('shows the count of the metric out of its total with the rate', () => {
    const metricApi = metricsSeeder.getMetricApi()
    wrapper = mount(MetricCard, {
      props: {
        metric: MetricsDto.fromMetric('returning_readers', metricApi),
        inactiveAfterDays: 30,
      },
    })

    expect(wrapper.find('.metric-card__label').text()).toBe(
      t('metric_card.metrics.returning_readers.label'),
    )
    expect(wrapper.find('.metric-card__count').text()).toBe(String(metricApi.count))
    expect(wrapper.find('.metric-card__total').text()).toBe(
      t('metric_card.out_of', { total: metricApi.total }),
    )
    expect(wrapper.find('.metric-card__rate').text()).toBe(t('metric_card.rate', { rate: 25 }))
  })

  it('shows only the count of a metric without total', () => {
    wrapper = mount(MetricCard, {
      props: {
        metric: MetricsDto.fromMetric('likes', metricsSeeder.getMetricApi({ total: null })),
        inactiveAfterDays: 30,
      },
    })

    expect(wrapper.find('.metric-card__total').exists()).toBe(false)
    expect(wrapper.find('.metric-card__rate').exists()).toBe(false)
  })

  it('states the inactivity delay in the description of inactive continuations', () => {
    wrapper = mount(MetricCard, {
      props: {
        metric: MetricsDto.fromMetric('inactive_continuations', metricsSeeder.getMetricApi()),
        inactiveAfterDays: 45,
      },
    })

    expect(wrapper.find('.metric-card__description').text()).toBe(
      t('metric_card.metrics.inactive_continuations.description', { days: 45 }),
    )
  })
})

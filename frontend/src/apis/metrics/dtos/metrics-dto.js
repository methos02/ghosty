const PERCENT = 100

const fromMetric = (key, metric) => {
  const counted = {
    key,
    count: metric.count,
  }

  if (!metric.total) {
    return counted
  }

  return {
    ...counted,
    total: metric.total,
    rate: Math.round((metric.count * PERCENT) / metric.total),
  }
}

const fromShow = report => {
  return {
    days: report.period.days,
    inactiveAfterDays: report.inactive_after_days,
    metrics: Object.entries(report.metrics).map(([key, metric]) =>
      MetricsDto.fromMetric(key, metric),
    ),
  }
}

const toShowParams = days => {
  return { days }
}

export const MetricsDto = {
  fromMetric,
  fromShow,
  toShowParams,
}

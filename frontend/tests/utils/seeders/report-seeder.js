const getReportData = (overrides = {}) => ({
  reason: 'hate_speech',
  description: 'Le chapitre s’en prend nommément à un groupe de lecteurs.',
  ...overrides,
})

export const reportSeeder = {
  getReportData,
}

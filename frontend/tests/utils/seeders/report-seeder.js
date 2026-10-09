const getReportData = (overrides = {}) => ({
  reason: 'hate_speech',
  description: 'Le chapitre s’en prend nommément à un groupe de lecteurs.',
  ...overrides,
})

const getRefusalApi = (overrides = {}) => ({
  message: 'Vous avez déjà signalé ce contenu',
  ...overrides,
})

export const reportSeeder = {
  getReportData,
  getRefusalApi,
}

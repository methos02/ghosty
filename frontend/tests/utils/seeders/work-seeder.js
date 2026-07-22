const getWorkApi = (overrides = {}) => ({
  id: 10,
  title: 'Chapitre 1',
  content: 'Il était une fois un fantôme...',
  order: 1,
  type: 1,
  novel_id: 1,
  ...overrides,
})

const getWorksApi = (count = 3) => {
  return Array.from({ length: count }, (_, index) =>
    getWorkApi({
      id: index + 10,
      title: `Chapitre ${index + 1}`,
      order: index + 1,
    }),
  )
}

export const workSeeder = { getWorkApi, getWorksApi }

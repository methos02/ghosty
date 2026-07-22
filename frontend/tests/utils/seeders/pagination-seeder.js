const getMetaApi = (overrides = {}) => ({
  current_page: 1,
  per_page: 15,
  total: 45,
  last_page: 3,
  ...overrides,
})

export const paginationSeeder = { getMetaApi }

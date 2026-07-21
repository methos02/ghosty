const fromMeta = (data) => ({
  page: data.current_page,
  nextPage: data.current_page + 1,
  size: data.per_page,
  total: data.total,
  lastPage: data.last_page,
})

export const PaginationDto = { fromMeta }

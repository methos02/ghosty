export const paginatorHelper = {
    calculTotalPage : (totalItems, limit) => Math.ceil(totalItems / limit),
    calculSkip:(page_number, limit) => (page_number - 1) * limit,
    currentPage : (skip, limit) => (skip / limit) + 1
}

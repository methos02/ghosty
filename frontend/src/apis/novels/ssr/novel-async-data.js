export const novelDetailAsyncData = async ({ stores, route }) => {
  const [{ NovelController }, { STATUS }] = await Promise.all([
    import('@/apis/novels/controllers/novel-controller.js'),
    import('@/constants/ajax-constants.js'),
  ])

  const novelResponse = await NovelController.getBySlug(route.params.slug)
  if (novelResponse.status === STATUS.SUCCESS) {
    stores.novel.setSelectedNovel(novelResponse.novel)
  }

  return { statusCode: novelResponse.status }
}

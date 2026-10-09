export const novelDetailAsyncData = async ({ stores, route }) => {
  const [{ NovelController }, { ajaxHelper }] = await Promise.all([
    import('@/apis/novels/controllers/novel-controller.js'),
    import('@/core/helpers/ajax-helper.js'),
  ])

  const novelResponse = await NovelController.getBySlug(route.params.slug)
  if (ajaxHelper.isSuccess(novelResponse.status)) {
    stores.novel.setSelectedNovel(novelResponse.novel)
  }

  return { statusCode: novelResponse.status }
}

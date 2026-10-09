export const chapterReadingAsyncData = async ({ stores, route, cookie }) => {
  const [{ ChapterController }, { ajaxHelper }] = await Promise.all([
    import('@/apis/chapters/controllers/chapter-controller.js'),
    import('@/core/helpers/ajax-helper.js'),
  ])

  const response = await ChapterController.reading(
    route.params.slug,
    route.params.id,
    viewerOptions(cookie),
  )
  if (ajaxHelper.isSuccess(response.status)) {
    stores.novel.setSelectedNovel(response.novel)
    stores.reading.setReading(response)
  }

  return { statusCode: response.status }
}

export const multiverseAsyncData = async ({ stores, route, cookie }) => {
  const [{ ChapterController }, { NovelController }, { ajaxHelper }] = await Promise.all([
    import('@/apis/chapters/controllers/chapter-controller.js'),
    import('@/apis/novels/controllers/novel-controller.js'),
    import('@/core/helpers/ajax-helper.js'),
  ])

  const novelResponse = await NovelController.getBySlug(route.params.slug)
  if (!ajaxHelper.isSuccess(novelResponse.status)) {
    return { statusCode: novelResponse.status }
  }

  stores.novel.setSelectedNovel(novelResponse.novel)

  const treeResponse = await ChapterController.tree(
    route.params.slug,
    route.query.from,
    viewerOptions(cookie),
  )
  if (ajaxHelper.isSuccess(treeResponse.status)) {
    stores.tree.setTree(treeResponse)
  }

  return { statusCode: treeResponse.status }
}

const viewerOptions = cookie => {
  if (!cookie) {
    return {}
  }

  return { headers: { Cookie: cookie } }
}

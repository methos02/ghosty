export const chapterReadingAsyncData = async ({ stores, route }) => {
  const [{ ChapterController }, { STATUS }] = await Promise.all([
    import('@/apis/chapters/controllers/chapter-controller.js'),
    import('@/constants/ajax-constants.js'),
  ])

  const response = await ChapterController.reading(route.params.slug, route.params.id)
  if (response.status === STATUS.SUCCESS) {
    stores.novel.setSelectedNovel(response.novel)
    stores.reading.setReading(response)
  }

  return { statusCode: response.status }
}

export const multiverseAsyncData = async ({ stores, route }) => {
  const [{ ChapterController }, { NovelController }, { STATUS }] = await Promise.all([
    import('@/apis/chapters/controllers/chapter-controller.js'),
    import('@/apis/novels/controllers/novel-controller.js'),
    import('@/constants/ajax-constants.js'),
  ])

  const novelResponse = await NovelController.getBySlug(route.params.slug)
  if (novelResponse.status !== STATUS.SUCCESS) {
    return { statusCode: novelResponse.status }
  }

  stores.novel.setSelectedNovel(novelResponse.novel)

  const treeResponse = await ChapterController.tree(route.params.slug, route.query.from)
  if (treeResponse.status === STATUS.SUCCESS) {
    stores.tree.setTree(treeResponse)
  }

  return { statusCode: treeResponse.status }
}

export const chapterReadingAsyncData = async ({ stores, route, cookie }) => {
  const { useChapterReading } = await import('@/apis/chapters/composables/use-chapter-reading.js')
  const { chapterReading } = useChapterReading({
    readingStore: stores.reading,
    novelStore: stores.novel,
  })

  const response = await chapterReading.load(
    route.params.slug,
    route.params.id,
    viewerOptions(cookie),
  )

  return { statusCode: response.status }
}

export const multiverseAsyncData = async ({ stores, route, cookie }) => {
  const [{ useNovelDetail }, { useChapterTree }, { ajaxHelper }] = await Promise.all([
    import('@/apis/novels/composables/use-novel-detail.js'),
    import('@/apis/chapters/composables/use-chapter-tree.js'),
    import('@/core/helpers/ajax-helper.js'),
  ])
  const { novelDetail } = useNovelDetail({ novelStore: stores.novel })
  const { chapterTree } = useChapterTree({ treeStore: stores.tree })

  const novelResponse = await novelDetail.selectBySlug(route.params.slug)
  if (!ajaxHelper.isSuccess(novelResponse.status)) {
    return { statusCode: novelResponse.status }
  }

  const treeResponse = await chapterTree.load(
    route.params.slug,
    route.query.from,
    viewerOptions(cookie),
  )

  return { statusCode: treeResponse.status }
}

const viewerOptions = cookie => {
  if (!cookie) {
    return {}
  }

  return { headers: { Cookie: cookie } }
}

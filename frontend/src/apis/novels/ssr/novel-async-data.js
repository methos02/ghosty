export const novelDetailAsyncData = async ({ stores, route }) => {
  const { useNovelDetail } = await import('@/apis/novels/composables/use-novel-detail.js')
  const { novelDetail } = useNovelDetail({ novelStore: stores.novel })

  const response = await novelDetail.selectBySlug(route.params.slug)

  return { statusCode: response.status }
}

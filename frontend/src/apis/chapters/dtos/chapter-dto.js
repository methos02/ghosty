const fromShow = chapter => {
  return {
    id: chapter.id,
    novelId: chapter.novel_id,
    parentId: chapter.parent_id,
    title: chapter.title,
    summary: chapter.summary,
    content: chapter.content,
    depth: chapter.depth,
    isContinued: chapter.is_continued,
    continuationsCount: chapter.continuations_count,
    likeCount: chapter.like_count,
    branchLikeCount: chapter.branch_like_count,
    commentCount: chapter.comment_count,
    isDraft: chapter.is_draft,
    isCorrectable: chapter.is_correctable,
    isRoot: chapter.is_root,
    novel: {
      id: chapter.novel?.id,
      slug: chapter.novel?.slug,
      title: chapter.novel?.title,
      genreId: chapter.novel?.genre_id,
    },
    author: {
      id: chapter.author?.id,
      username: chapter.author?.username,
    },
    publishedAt: chapter.published_at,
  }
}

const fromList = (chapters = []) => {
  return chapters.map(chapter => fromShow(chapter))
}

const toCreate = formData => ({
  parent_id: formData.parentId,
  title: formData.title,
  content: formData.content,
  summary: formData.summary,
  is_draft: formData.isDraft,
})

const toCreateParams = novelSlug => {
  return { slug: novelSlug }
}

const toCurrentContinuityParams = novelSlug => {
  return { slug: novelSlug }
}

const toUpdate = formData => ({
  title: formData.title,
  content: formData.content,
  summary: formData.summary,
})

const toDraftFilters = (filters = {}) => ({
  parent_id: filters.parentId,
  is_root: filters.isRoot,
})

const toChapterParams = id => {
  return { chapter: id }
}

export const ChapterDto = {
  fromShow,
  fromList,
  toCreate,
  toCreateParams,
  toChapterParams,
  toDraftFilters,
  toCurrentContinuityParams,
  toUpdate,
}

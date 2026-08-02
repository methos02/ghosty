const fromShow = chapter => {
  return {
    id: chapter.id,
    novelId: chapter.novel_id,
    parentId: chapter.parent_id,
    title: chapter.title,
    summary: chapter.summary,
    content: chapter.content,
    depth: chapter.depth,
    isMainChild: chapter.is_main_child,
    isBranch: chapter.is_branch,
    continuationsCount: chapter.continuations_count,
    likeCount: chapter.like_count,
    commentCount: chapter.comment_count,
    author: {
      id: chapter.author?.id,
      pseudo: chapter.author?.pseudo,
    },
    publishedAt: chapter.published_at,
  }
}

const fromList = (chapters = []) => {
  return chapters.map(chapter => fromShow(chapter))
}

const toMainContinuityParams = novelSlug => {
  return { slug: novelSlug }
}

const toShowParams = id => {
  return { chapter: id }
}

export const ChapterDto = {
  fromShow,
  fromList,
  toMainContinuityParams,
  toShowParams,
}

const fromLike = data => ({
  isLiked: data.is_liked,
  likeCount: data.like_count,
})

const toChapterParams = chapterId => {
  return { chapter: chapterId }
}

export const LikeDto = {
  fromLike,
  toChapterParams,
}

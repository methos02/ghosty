import { NovelDto } from '@/apis/novels/dtos/novel-dto.js'

const fromList = (datas = []) => {
  return datas.map(data => fromShow(data))
}

const fromReading = data => ({
  novel: NovelDto.fromShow(data.novel),
  chapter: fromShow(data.chapter),
  ancestors: fromList(data.ancestors),
  children: fromList(data.children),
  branchChapterIds: data.branch_chapter_ids ?? [],
  isCurrentBranch: data.is_current_branch === true,
  nextChapterId: data.next_chapter_id,
})

const fromShow = data => {
  return {
    id: data.id,
    novelId: data.novel_id,
    parentId: data.parent_id,
    title: data.title,
    summary: data.summary,
    content: data.content,
    paragraphs: ChapterDtoInternal.convertToParagraphs(data.content),
    depth: data.depth,
    hasChildren: data.has_children,
    childrenCount: data.children_count,
    likeCount: data.like_count,
    branchLikeCount: data.branch_like_count,
    commentCount: data.comment_count,
    isDraft: data.is_draft,
    isCorrectable: data.is_correctable,
    isRoot: data.is_root,
    novel: {
      id: data.novel?.id,
      slug: data.novel?.slug,
      title: data.novel?.title,
      genreId: data.novel?.genre_id,
    },
    author: {
      id: data.author?.id,
      username: data.author?.username,
    },
    publishedAt: data.published_at,
  }
}

const fromTree = data => ({
  chapters: fromList(data.chapters),
  currentBranchIds: data.current_branch_ids ?? [],
})

const toChapterParams = id => {
  return { chapter: id }
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

const toCurrentBranchParams = novelSlug => {
  return { slug: novelSlug }
}

const toDraftFilters = (filters = {}) => ({
  parent_id: filters.parentId,
  is_root: filters.isRoot,
})

const toReadingParams = (novelSlug, chapterId) => {
  return { slug: novelSlug, chapter: chapterId }
}

const toTreeParams = (novelSlug, fromChapterId) => {
  return { slug: novelSlug, from: fromChapterId }
}

const toUpdate = formData => ({
  title: formData.title,
  content: formData.content,
  summary: formData.summary,
})

export const ChapterDto = {
  fromList,
  fromReading,
  fromShow,
  fromTree,
  toChapterParams,
  toCreate,
  toCreateParams,
  toCurrentBranchParams,
  toDraftFilters,
  toReadingParams,
  toTreeParams,
  toUpdate,
}

const convertToParagraphs = content => {
  return String(content ?? '')
    .split(/\n+/)
    .map(paragraph => paragraph.trim())
    .filter(Boolean)
}

export const ChapterDtoInternal = {
  convertToParagraphs,
}

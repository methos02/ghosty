import { AuthorDto } from '@/apis/authors/dtos/author-dto.js'
import { NovelDto } from '@/apis/novels/dtos/novel-dto.js'
import { CHAPTER_STATUSES } from '@/constants/chapter-constants.js'
import { dateHelper } from '@/core/helpers/date-helper.js'
import { passageRemovalHelper } from '@/core/helpers/passage-removal-helper.js'

const fromList = (chapters = []) => {
  return chapters.map(chapter => ChapterDto.fromShow(chapter))
}

const fromPublished = novels => {
  return novels.map(novel => ({
    novel: NovelDto.fromShow(novel),
    chapters: ChapterDto.fromList(novel.chapters),
  }))
}

const fromReading = reading => ({
  novel: NovelDto.fromShow(reading.novel),
  chapter: ChapterDto.fromShow(reading.chapter),
  ancestors: ChapterDto.fromList(reading.ancestors),
  children: ChapterDto.fromList(reading.children),
  branchChapterIds: reading.branch_chapter_ids ?? [],
  isMainBranch: reading.is_main_branch === true,
  nextChapterId: reading.next_chapter_id,
})

const fromShow = chapter => {
  return {
    id: chapter.id,
    novelId: chapter.novel_id,
    parentId: chapter.parent_id,
    title: chapter.title,
    summary: chapter.summary ?? '',
    content: chapter.content,
    paragraphs: ChapterDtoInternal.convertToParagraphs(chapter.content),
    depth: chapter.depth,
    hasChildren: chapter.has_children,
    childrenCount: chapter.children_count,
    likeCount: chapter.like_count,
    branchLikeCount: chapter.branch_like_count,
    isLiked: chapter.is_liked,
    isReported: chapter.is_reported === true,
    isFollowed: chapter.is_followed === true,
    commentCount: chapter.comment_count,
    isDraft: chapter.is_draft,
    isArchived: chapter.status === CHAPTER_STATUSES.ARCHIVED,
    isHidden: chapter.status === CHAPTER_STATUSES.HIDDEN,
    isCorrectable: chapter.is_correctable,
    isRoot: chapter.is_root,
    novel: NovelDto.fromSummary(chapter.novel),
    author: AuthorDto.fromShow(chapter.author),
    publishedAt: chapter.published_at,
    publishedAtFormat: chapter.published_at
      ? dateHelper.formatDateLocal(chapter.published_at, 'DD/MM/YYYY')
      : '-',
  }
}

const fromSummary = chapter => ({
  id: chapter.id,
  title: chapter.title,
})

const fromTree = tree => ({
  chapters: ChapterDto.fromList(tree.chapters),
  mainBranchIds: tree.main_branch_ids ?? [],
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

const toDraftFilters = (filters = {}) => ({
  parent_id: filters.parentId,
  is_root: filters.isRoot,
})

const toMainBranchParams = novelSlug => {
  return { slug: novelSlug }
}

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
  fromPublished,
  fromReading,
  fromShow,
  fromSummary,
  fromTree,
  toChapterParams,
  toCreate,
  toCreateParams,
  toDraftFilters,
  toMainBranchParams,
  toReadingParams,
  toTreeParams,
  toUpdate,
}

const convertToParagraphs = content => {
  return String(content ?? '')
    .split(/\n+/)
    .map(paragraph => paragraph.trim())
    .filter(Boolean)
    .map(paragraph => passageRemovalHelper.split(paragraph))
}

export const ChapterDtoInternal = {
  convertToParagraphs,
}

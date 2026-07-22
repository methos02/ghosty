const fromShow = work => {
  return {
    id: work.id,
    title: work.title,
    content: work.content,
    order: work.order,
    type: work.type === 1 ? 'chapter' : 'cover',
    novelId: work.novel_id,
  }
}

const fromList = (works = []) => {
  return works.map(work => fromShow(work))
}

const toChapterFilters = (novelSlug, order) => {
  return {
    novel_slug: novelSlug,
    order,
    type: 1,
  }
}

const toShowParams = id => {
  return { id }
}

const toCreate = workData => {
  return {
    title: workData.title,
    content: workData.content,
    novel_id: workData.novelId,
  }
}

const toUpdate = workData => {
  return {
    title: workData.title,
    content: workData.content,
  }
}

const toVote = value => {
  return { value }
}

export const WorkDto = {
  fromList,
  fromShow,
  toChapterFilters,
  toShowParams,
  toCreate,
  toUpdate,
  toVote,
}

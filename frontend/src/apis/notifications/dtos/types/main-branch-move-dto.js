const fromNotification = data => ({
  chapters: data.data.chapters.map(chapter => ({
    id: chapter.id,
    title: chapter.title,
  })),
  count: data.data.count,
})

export const MainBranchMoveDto = {
  fromNotification,
}

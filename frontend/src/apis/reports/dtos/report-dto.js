const toChapterParams = chapterId => {
  return { chapter: chapterId }
}

const toCreate = formData => ({
  reason: formData.reason,
  description: formData.description,
})

export const ReportDto = {
  toChapterParams,
  toCreate,
}

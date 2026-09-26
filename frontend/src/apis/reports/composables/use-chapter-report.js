import { ref, readonly } from 'vue'
import { useAuth } from '@/services/auth/src/use-auth.js'
import { useAuthStore } from '@/services/auth/src/auth-store.js'

const reportedChapter = ref()
const sentReports = ref({})

const closeChapterReport = () => {
  reportedChapter.value = undefined
}

const isAlreadyReported = chapter =>
  chapter.isReported === true || sentReports.value[chapter.id] === true

const markAsReported = chapterId => {
  sentReports.value = { ...sentReports.value, [chapterId]: true }
}

export const useChapterReport = () => {
  const authStore = useAuthStore()
  const { openLoginDialog } = useAuth()

  const isOwnChapter = chapter => chapter.author.id === authStore.user.value?.id

  const canReport = chapter => !authStore.isAuthenticated.value || !isOwnChapter(chapter)

  const openChapterReport = chapter => {
    if (!authStore.isAuthenticated.value) {
      openLoginDialog()
      return
    }

    reportedChapter.value = chapter
  }

  return {
    reportedChapter: readonly(reportedChapter),
    canReport,
    isAlreadyReported,
    markAsReported,
    openChapterReport,
    closeChapterReport,
  }
}

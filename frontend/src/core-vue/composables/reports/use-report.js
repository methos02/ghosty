import { ref, readonly } from 'vue'
import { useAuth } from '@/services/auth/src/use-auth.js'
import { useAuthStore } from '@/services/auth/src/auth-store.js'
import { REPORTED_CONTENT_TYPES } from '@/constants/moderation-constants.js'

const reportedContent = ref()
const sentReports = ref({})

const closeReport = () => {
  reportedContent.value = undefined
}

const isAlreadyReported = reported => {
  return (
    reported.content.isReported === true
    || sentReports.value[internals.sentReportKey(reported)] === true
  )
}

const markAsReported = reported => {
  sentReports.value = {
    ...sentReports.value,
    [internals.sentReportKey(reported)]: true,
  }
}

export const useReport = () => {
  const authStore = useAuthStore()
  const { openLoginDialog } = useAuth()

  const canReport = content => {
    return !authStore.isAuthenticated.value || content.author.id !== authStore.user.value?.id
  }

  const openReport = (type, content) => {
    if (!authStore.isAuthenticated.value) {
      openLoginDialog()
      return
    }

    reportedContent.value = { type, content }
  }

  const openChapterReport = chapter => {
    openReport(REPORTED_CONTENT_TYPES.CHAPTER, chapter)
  }

  const openCommentReport = comment => {
    openReport(REPORTED_CONTENT_TYPES.COMMENT, comment)
  }

  const openCoverReport = cover => {
    openReport(REPORTED_CONTENT_TYPES.COVER, cover)
  }

  return {
    reportedContent: readonly(reportedContent),
    report: {
      canReport,
      closeReport,
      isAlreadyReported,
      markAsReported,
      openChapterReport,
      openCommentReport,
      openCoverReport,
    },
  }
}

const sentReportKey = reported => {
  return `${reported.type}:${reported.content.id}`
}

export const internals = {
  sentReportKey,
}

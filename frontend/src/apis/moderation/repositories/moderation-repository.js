import { req } from '@/services/shortcuts/services-shortcut.js'
import { MODERATION_DECISION_ERRORS } from '@/constants/moderation-constants.js'

const listReportedContents = async options => {
  return await req('moderation.reportedContents', options)
}

const moderateChapter = async options => {
  return await req('moderation.moderateChapter', {
    ...options,
    errors: MODERATION_DECISION_ERRORS,
  })
}

const moderateComment = async options => {
  return await req('moderation.moderateComment', {
    ...options,
    errors: MODERATION_DECISION_ERRORS,
  })
}

const moderateCover = async options => {
  return await req('moderation.moderateCover', {
    ...options,
    errors: MODERATION_DECISION_ERRORS,
  })
}

const restoreChapter = async options => {
  return await req('moderation.restoreChapter', options)
}

const restoreComment = async options => {
  return await req('moderation.restoreComment', options)
}

const restoreCover = async options => {
  return await req('moderation.restoreCover', options)
}

const showChapter = async options => {
  return await req('moderation.showChapter', options)
}

const showComment = async options => {
  return await req('moderation.showComment', options)
}

const showCover = async options => {
  return await req('moderation.showCover', options)
}

export const ModerationRepository = {
  listReportedContents,
  moderateChapter,
  moderateComment,
  moderateCover,
  restoreChapter,
  restoreComment,
  restoreCover,
  showChapter,
  showComment,
  showCover,
}

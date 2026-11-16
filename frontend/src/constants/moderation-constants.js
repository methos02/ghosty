export const REPORTED_CONTENT_TYPES = {
  CHAPTER: 'chapter',
  COMMENT: 'comment',
  COVER: 'novel_cover',
  USER: 'user',
}

export const RESOLUTIONS = {
  DISMISSED: 'dismissed',
  HIDDEN: 'hidden',
  PASSAGE_REMOVED: 'passage_removed',
  SANCTIONED: 'sanctioned',
}

export const SANCTION_TYPES = {
  WARNING: 'warning',
  WRITE_BAN: 'write_ban',
  COMMENT_BAN: 'comment_ban',
  ACCOUNT_BAN: 'account_ban',
}

export const REPORT_STATUSES = {
  PENDING: 1,
  PROCESSED: 2,
}

export const MODERATION_DECISION_ERRORS = {
  409: 'moderation_decision.already_processed',
}

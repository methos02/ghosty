import { STATUS } from '@/constants/ajax-constants.js'

export const PROFILE_GUARD_STATUSES = [STATUS.NOT_FOUND]

export const PROFILE_TABS = {
  NOVELS: 'profile',
  CHAPTERS: 'profile-chapters',
  BRANCHES: 'profile-branches',
  COVERS: 'profile-covers',
}

export const PROFILE_MENU = [
  { tab: PROFILE_TABS.NOVELS, icon: 'fa-solid fa-book' },
  { tab: PROFILE_TABS.CHAPTERS, icon: 'fa-regular fa-file-lines' },
  { tab: PROFILE_TABS.BRANCHES, icon: 'fa-solid fa-code-branch' },
  { tab: PROFILE_TABS.COVERS, icon: 'fa-regular fa-image' },
]

export const USER_ROLES = {
  READER: 'reader',
  AUTHOR: 'author',
  ILLUSTRATOR: 'illustrator',
  MODERATOR: 'moderator',
  ADMIN: 'admin',
}

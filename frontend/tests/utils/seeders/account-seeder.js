import { NOTIFICATION_TYPES } from '@/constants/notification-constants.js'
import { userSeeder } from '&/utils/seeders/user-seeder.js'

const getUsernameAvailabilityApi = (overrides = {}) => ({
  available: true,
  ...overrides,
})

const getProfileForm = (overrides = {}) => ({
  username: 'PlumeNouvelle',
  ...overrides,
})

const getNotificationsForm = (overrides = {}) => ({
  types: {
    [NOTIFICATION_TYPES.CHAPTER_CONTINUED]: true,
    [NOTIFICATION_TYPES.FOLLOWED_BRANCH_EXTENDED]: true,
    [NOTIFICATION_TYPES.MAIN_BRANCH_GAINED]: true,
    [NOTIFICATION_TYPES.MAIN_BRANCH_LOST]: true,
    [NOTIFICATION_TYPES.LIKE_RECEIVED]: false,
    [NOTIFICATION_TYPES.COMMENT_RECEIVED]: true,
    [NOTIFICATION_TYPES.COMMENT_REPLIED]: false,
    [NOTIFICATION_TYPES.COVER_SELECTED]: true,
    [NOTIFICATION_TYPES.REPORT_PROCESSED]: true,
  },
  ...overrides,
})

const getUpdatedUserApi = (overrides = {}) =>
  userSeeder.getUserApi({
    username: 'PlumeNouvelle',
    profile_slug: 'usr042-plumenouvelle',
    ...overrides,
  })

const getEmailForm = (overrides = {}) => ({
  email: 'plume@ghosty.test',
  currentPassword: 'Secret123!',
  ...overrides,
})

const getPasswordForm = (overrides = {}) => ({
  currentPassword: 'Secret123!',
  password: 'NouveauSecret456!',
  passwordConfirmation: 'NouveauSecret456!',
  ...overrides,
})

const getDeletionForm = (overrides = {}) => ({
  currentPassword: 'Secret123!',
  ...overrides,
})

const getAvatarImageFile = ({ width = 600, height = 400 } = {}) =>
  new globalThis.File([JSON.stringify({ width, height })], 'portrait.png', { type: 'image/png' })

const getValidationErrorsApi = (field, message) => ({
  message,
  errors: { [field]: [message] },
})

export const accountSeeder = {
  getAvatarImageFile,
  getDeletionForm,
  getEmailForm,
  getNotificationsForm,
  getPasswordForm,
  getProfileForm,
  getUpdatedUserApi,
  getUsernameAvailabilityApi,
  getValidationErrorsApi,
}

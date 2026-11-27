export const accountRoutesApi = {
  'account.usernameAvailability': {
    url: 'v1/me/account/username-availability',
    method: 'get',
    api: 'ghosty',
  },
  'account.updateProfile': {
    url: 'v1/me/account/profile',
    method: 'post',
    api: 'ghosty',
  },
  'account.updateNotifications': {
    url: 'v1/me/account/notifications',
    method: 'put',
    api: 'ghosty',
  },
  'account.updateEmail': {
    url: 'v1/me/account/email',
    method: 'put',
    api: 'ghosty',
  },
  'account.updatePassword': {
    url: 'v1/me/account/password',
    method: 'put',
    api: 'ghosty',
  },
  'account.deleteAvatar': {
    url: 'v1/me/account/avatar',
    method: 'delete',
    api: 'ghosty',
  },
  'account.destroy': {
    url: 'v1/me/account',
    method: 'delete',
    api: 'ghosty',
  },
}

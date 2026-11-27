export const notificationRoutesApi = {
  'notification.list': {
    url: 'v1/me/notifications',
    method: 'get',
    api: 'ghosty',
  },
  'notification.read': {
    url: 'v1/me/notifications/{notification}/read',
    method: 'post',
    api: 'ghosty',
  },
  'notification.readAll': {
    url: 'v1/me/notifications/read-all',
    method: 'patch',
    api: 'ghosty',
  },
}

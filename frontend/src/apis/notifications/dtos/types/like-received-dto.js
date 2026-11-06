const fromNotification = notification => ({
  lastActorUsername: notification.last_actor_username,
  count: notification.count,
})

export const LikeReceivedDto = {
  fromNotification,
}

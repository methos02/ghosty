const fromNotification = data => ({
  lastActorUsername: data.data.last_actor_username,
  count: data.data.count,
})

export const LikeReceivedDto = {
  fromNotification,
}

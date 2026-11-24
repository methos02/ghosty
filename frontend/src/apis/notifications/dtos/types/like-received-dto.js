const fromNotification = notification => {
  return {
    lastActorUsername: notification.last_actor_username,
    lastActorProfileSlug: notification.last_actor_profile_slug,
    count: notification.count,
  }
}

export const LikeReceivedDto = {
  fromNotification,
}

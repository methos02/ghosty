export const profileAsyncData = async ({ stores, route }) => {
  const [{ useUserProfile }, { ajaxHelper }, { profileSlugHelper }, { STATUS }] = await Promise.all([
    import('@/core-vue/composables/users/use-user-profile.js'),
    import('@/core/helpers/ajax-helper.js'),
    import('@/core/helpers/profile-slug-helper.js'),
    import('@/constants/ajax-constants.js'),
  ])
  const { userProfile } = useUserProfile({ profileStore: stores.profile })

  const response = await userProfile.load(route.params.profileSlug)
  if (!ajaxHelper.isSuccess(response.status)) {
    return { statusCode: response.status }
  }

  const redirect = profileSlugHelper.canonicalLocation(route, stores.profile.profile.value)
  if (redirect) {
    return {
      redirect,
      statusCode: STATUS.MOVED_PERMANENTLY,
    }
  }

  return { statusCode: response.status }
}

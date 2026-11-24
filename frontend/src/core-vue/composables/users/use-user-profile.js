import { UserController } from '@/apis/users/controllers/user-controller.js'
import { useProfileStore } from '@/core-vue/stores/users/profile-store.js'
import { STATUS } from '@/constants/ajax-constants.js'
import { ajaxHelper } from '@/core/helpers/ajax-helper.js'
import { profileSlugHelper } from '@/core/helpers/profile-slug-helper.js'

export const useUserProfile = ({ profileStore = useProfileStore() } = {}) => {
  const load = async profileSlug => {
    const slug = profileSlugHelper.toSlug(profileSlug)
    if (profileStore.profile.value?.slug === slug) {
      return { status: STATUS.SUCCESS }
    }

    profileStore.clear()
    const response = await UserController.show(slug)
    if (!ajaxHelper.isSuccess(response.status)) {
      return response
    }

    profileStore.setProfile(response.profile)

    return response
  }

  return {
    userProfile: {
      load,
    },
  }
}

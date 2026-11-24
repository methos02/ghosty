import { form } from '@/services/shortcuts/services-shortcut.js'
import { ConfigLoader } from '@/config/config-loader.js'
import { imageCropHelper } from '@/core/helpers/image-crop-helper.js'

const avatarCropFormRules = {
  image: {
    rules: 'readable|largeEnough',
    tests: {
      readable: image => (image.width > 0 ? '' : 'readable'),
      largeEnough: image => {
        const source = {
          size: image,
          format: ConfigLoader.get('account.avatar'),
        }
        return imageCropHelper.isLargeEnough(source) ? '' : 'largeEnough'
      },
    },
    errors: {
      readable: 'account_avatar_section.error_unreadable',
      largeEnough: 'account_avatar_section.error_too_small',
    },
  },
}

export const validateAvatarCropForm = image => {
  return form.validate(avatarCropFormRules, { image }, { form: 'accountProfile' })
}

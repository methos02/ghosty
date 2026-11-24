import { form } from '@/services/shortcuts/services-shortcut.js'
import { ConfigLoader } from '@/config/config-loader.js'
import { imageCropHelper } from '@/core/helpers/image-crop-helper.js'

const coverCropFormRules = {
  image: {
    rules: 'readable|largeEnough',
    tests: {
      readable: image => (image.width > 0 ? '' : 'readable'),
      largeEnough: image => {
        const source = {
          size: image,
          format: ConfigLoader.get('cover'),
        }
        return imageCropHelper.isLargeEnough(source) ? '' : 'largeEnough'
      },
    },
    errors: {
      readable: 'cover_image_field.error_unreadable',
      largeEnough: 'cover_image_field.error_too_small',
    },
  },
}

export const validateCoverCropForm = image => {
  return form.validate(coverCropFormRules, { image }, { form: 'cover' })
}

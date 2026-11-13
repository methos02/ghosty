import { ConfigLoader } from '@/config/config-loader.js'
import { imageCropHelper } from '@/core/helpers/image-crop-helper.js'

const decode = async file => {
  try {
    const bitmap = await globalThis.createImageBitmap(file)
    return {
      bitmap,
      width: bitmap.width,
      height: bitmap.height,
    }
  } catch {
    return { width: 0, height: 0 }
  }
}

const renderCrop = async (bitmap, crop) => {
  const size = imageCropHelper.outputSize(crop)
  const canvas = new globalThis.OffscreenCanvas(size.width, size.height)
  const source = [crop.x, crop.y, crop.width, crop.height]
  canvas.getContext('2d').drawImage(bitmap, ...source, 0, 0, size.width, size.height)

  const type = ConfigLoader.get('cover.outputType')
  const blob = await canvas.convertToBlob({
    type,
    quality: ConfigLoader.get('cover.outputQuality'),
  })

  return new globalThis.File([blob], ConfigLoader.get('cover.outputName'), { type })
}

export const imageFileHelper = {
  decode,
  renderCrop,
}

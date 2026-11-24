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

const renderCrop = async (bitmap, crop, format) => {
  const size = imageCropHelper.outputSize(crop, format)
  const canvas = new globalThis.OffscreenCanvas(size.width, size.height)
  const source = [crop.x, crop.y, crop.width, crop.height]
  canvas.getContext('2d').drawImage(bitmap, ...source, 0, 0, size.width, size.height)

  const blob = await canvas.convertToBlob({
    type: format.outputType,
    quality: format.outputQuality,
  })

  return new globalThis.File([blob], format.outputName, { type: format.outputType })
}

export const imageFileHelper = {
  decode,
  renderCrop,
}

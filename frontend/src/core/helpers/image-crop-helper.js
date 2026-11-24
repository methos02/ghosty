const HALF = 2
const PERCENT = 100

const clamp = (value, min, max) => {
  return Math.min(Math.max(value, min), max)
}

const clampCrop = (crop, size) => {
  return {
    ...crop,
    x: clamp(crop.x, 0, size.width - crop.width),
    y: clamp(crop.y, 0, size.height - crop.height),
  }
}

const dragCrop = (crop, size, drag) => {
  const sourcePixelsPerFramePixel = crop.width / drag.frameWidth
  const moved = {
    ...crop,
    x: crop.x - drag.x * sourcePixelsPerFramePixel,
    y: crop.y - drag.y * sourcePixelsPerFramePixel,
  }

  return clampCrop(moved, size)
}

const fullCrop = source => {
  const { size, format } = source
  const width = Math.min(size.width, size.height * format.ratio)
  const height = width / format.ratio

  return {
    x: (size.width - width) / HALF,
    y: (size.height - height) / HALF,
    width,
    height,
  }
}

const isLargeEnough = source => {
  return imageCropHelper.maxZoom(source) >= 1
}

const maxZoom = source => {
  return imageCropHelper.fullCrop(source).width / source.format.minWidth
}

const outputSize = (crop, format) => {
  const width = Math.round(Math.min(crop.width, format.maxWidth))

  return { width, height: Math.round(width / format.ratio) }
}

const placement = (crop, size) => {
  return {
    width: (size.width / crop.width) * PERCENT,
    left: (-crop.x / crop.width) * PERCENT,
    top: (-crop.y / crop.height) * PERCENT,
  }
}

const zoomCrop = (crop, source, zoom) => {
  const width =
    imageCropHelper.fullCrop(source).width / clamp(zoom, 1, imageCropHelper.maxZoom(source))
  const height = width / source.format.ratio
  const centered = {
    x: crop.x + (crop.width - width) / HALF,
    y: crop.y + (crop.height - height) / HALF,
    width,
    height,
  }

  return clampCrop(centered, source.size)
}

const zoomOf = (crop, source) => {
  return imageCropHelper.fullCrop(source).width / crop.width
}

export const imageCropHelper = {
  dragCrop,
  fullCrop,
  isLargeEnough,
  maxZoom,
  outputSize,
  placement,
  zoomCrop,
  zoomOf,
}

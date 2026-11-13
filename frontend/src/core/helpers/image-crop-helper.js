import { ConfigLoader } from '@/config/config-loader.js'

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

const fullCrop = size => {
  const ratio = ConfigLoader.get('cover.ratio')
  const width = Math.min(size.width, size.height * ratio)
  const height = width / ratio

  return {
    x: (size.width - width) / HALF,
    y: (size.height - height) / HALF,
    width,
    height,
  }
}

const maxZoom = size => {
  return fullCrop(size).width / ConfigLoader.get('cover.minWidth')
}

const isLargeEnough = size => {
  return maxZoom(size) >= 1
}

const zoomOf = (crop, size) => {
  return fullCrop(size).width / crop.width
}

const zoomCrop = (crop, size, zoom) => {
  const width = fullCrop(size).width / clamp(zoom, 1, maxZoom(size))
  const height = width / ConfigLoader.get('cover.ratio')
  const centered = {
    x: crop.x + (crop.width - width) / HALF,
    y: crop.y + (crop.height - height) / HALF,
    width,
    height,
  }

  return clampCrop(centered, size)
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

const placement = (crop, size) => {
  return {
    width: (size.width / crop.width) * PERCENT,
    left: (-crop.x / crop.width) * PERCENT,
    top: (-crop.y / crop.height) * PERCENT,
  }
}

const outputSize = crop => {
  const width = Math.round(Math.min(crop.width, ConfigLoader.get('cover.maxWidth')))

  return { width, height: Math.round(width / ConfigLoader.get('cover.ratio')) }
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

import { ConfigLoader } from '@/config/config-loader.js'

const removeSelection = (text, selection) => {
  const marker = ConfigLoader.get('moderation.removedPassageMarker')

  return `${text.slice(0, selection.start)}${marker}${text.slice(selection.end)}`
}

const split = paragraph =>
  passageRemovalHelper.splitWithPositions(paragraph).map(segment => ({
    text: segment.text,
    isRemoved: segment.isRemoved,
  }))

const splitWithPositions = text => {
  const marker = ConfigLoader.get('moderation.removedPassageMarker')
  const segments = []
  let position = 0

  for (const [index, part] of text.split(marker).entries()) {
    if (index > 0) {
      segments.push(removedSegment(position, marker))
      position += marker.length
    }

    if (part !== '') {
      segments.push(textSegment(part, position))
      position += part.length
    }
  }

  return segments
}

export const passageRemovalHelper = {
  removeSelection,
  split,
  splitWithPositions,
}

const removedSegment = (position, marker) => ({
  text: '',
  isRemoved: true,
  start: position,
  end: position + marker.length,
})

const textSegment = (part, position) => ({
  text: part,
  isRemoved: false,
  start: position,
  end: position + part.length,
})

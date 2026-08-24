import { chapterConfig } from '@/config/chapter-config.js'

const PERCENT = 100

const allowanceFor = text => {
  const words = correctionHelper.countWords(text)
  const share = Math.floor((words * chapterConfig.correctionMaxChangedPercent) / PERCENT)

  return Math.max(chapterConfig.correctionMinChangedWords, share)
}

const changedWords = (published, corrected, allowance) => {
  return correctionHelperInternal.distanceWithin(
    correctionHelperInternal.split(published),
    correctionHelperInternal.split(corrected),
    allowance,
  )
}

const countWords = text => correctionHelperInternal.split(text).length

const isCorrectableBy = (chapter, userId) => {
  // see ADR-11-chapitre-publie-non-reecrivable
  return chapter?.isCorrectable === true && chapter?.author?.id === userId
}

export const correctionHelper = {
  allowanceFor,
  changedWords,
  countWords,
  isCorrectableBy,
}

const distanceWithin = (publishedWords, correctedWords, allowance) => {
  const [published, corrected] = correctionHelperInternal.trimCommonEnds(
    publishedWords,
    correctedWords,
  )
  const unreachable = allowance + 1

  if (Math.abs(published.length - corrected.length) > allowance) {
    return unreachable
  }

  const texts = {
    published,
    corrected,
    allowance,
  }
  let previous = correctionHelperInternal.firstRow(corrected.length, allowance)
  for (let row = 1; row <= published.length; row++) {
    previous = correctionHelperInternal.nextRow(previous, texts, row)
  }

  return previous[corrected.length] ?? unreachable
}

const firstRow = (correctedLength, allowance) => {
  const row = []
  for (let column = 0; column <= Math.min(correctedLength, allowance); column++) {
    row[column] = column
  }

  return row
}

const nextRow = (previous, texts, row) => {
  const { published, corrected, allowance } = texts
  const unreachable = allowance + 1
  const first = Math.max(1, row - allowance)
  const last = Math.min(corrected.length, row + allowance)
  const current = []
  current[first - 1] = first === 1 ? Math.min(row, unreachable) : unreachable

  for (let column = first; column <= last; column++) {
    const cost = published[row - 1] === corrected[column - 1] ? 0 : 1
    current[column] = Math.min(
      (previous[column] ?? unreachable) + 1,
      current[column - 1] + 1,
      (previous[column - 1] ?? unreachable) + cost,
      unreachable,
    )
  }

  return current
}

const split = text => {
  const words = String(text ?? '')
    .trim()
    .toLowerCase()
    .split(/\s+/u)

  return words.filter(word => word !== '')
}

const trimCommonEnds = (published, corrected) => {
  const shortest = Math.min(published.length, corrected.length)

  let head = 0
  while (head < shortest && published[head] === corrected[head]) {
    head++
  }

  let tail = 0
  while (
    tail < shortest - head &&
    published.at(published.length - 1 - tail) === corrected.at(corrected.length - 1 - tail)
  ) {
    tail++
  }

  return [
    published.slice(head, published.length - tail),
    corrected.slice(head, corrected.length - tail),
  ]
}

export const correctionHelperInternal = {
  distanceWithin,
  firstRow,
  nextRow,
  split,
  trimCommonEnds,
}

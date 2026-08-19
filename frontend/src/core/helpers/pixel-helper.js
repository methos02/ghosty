const PX_PATTERN = /^(-?\d+(?:\.\d+)?)px$/

const pxToNumber = pxString => {
  const match = PX_PATTERN.exec(pxString)

  if (!match) {
    throw new TypeError(
      `pixelHelper.pxToNumber attend un format "<nombre>px", reçu : "${pxString}"`,
    )
  }

  return Number(match[1])
}

const numberToPx = value => `${value}px`

export const pixelHelper = {
  pxToNumber,
  numberToPx,
}

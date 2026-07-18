const pxToNumber = pxString => {
  const value = Number(pxString.replace(/px$/, ''))

  if (Number.isNaN(value)) {
    throw new TypeError(`pxToNumber received a non-numeric value: "${pxString}"`)
  }

  return value
}

const numberToPx = value => `${value}px`

export const pixelHelper = {
  pxToNumber,
  numberToPx,
}

const state = {
  lastFlashNumber: 0,
}

const generateFlashId = () => {
  state.lastFlashNumber += 1

  return `flash-${state.lastFlashNumber}`
}

export const flashFunctions = {
  generateFlashId,
}

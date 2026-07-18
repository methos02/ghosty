export const flashFunctions = {
  generateFlashId: () => {
    // eslint-disable-next-line no-magic-numbers
    return Math.random().toString(16).slice(2)
  },
}

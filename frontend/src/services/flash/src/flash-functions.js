const generateFlashId = () => {
  return crypto.randomUUID()
}

export const flashFunctions = {
  generateFlashId,
}

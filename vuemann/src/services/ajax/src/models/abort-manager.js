const state = {
  abortController: undefined,
}

const setAbort = abort_option => {
  if (abort_option === undefined) {
    return
  }

  if (state.abortController !== undefined) {
    state.abortController.abort()
  }
  state.abortController = new AbortController()
}

const getAbort = () => {
  return state.abortController
}

const abortSignal = () => {
  return state.abortController.signal
}

export const abortManager = {
  setAbort,
  getAbort,
  abortSignal,
}

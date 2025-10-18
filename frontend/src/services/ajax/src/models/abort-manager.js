let abortController

const setAbort = abort_option => {
    if (abort_option === undefined) { return }

    if (abortController !== undefined) { abortController.abort() }
    abortController = new AbortController()
}

const getAbort = () => {
    return abortController
}

const abortSignal = () => {
    return abortController.signal
}

export const abortManager = {setAbort, getAbort, abortSignal}
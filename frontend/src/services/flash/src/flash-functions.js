export const flashFunctions = {
    generateFlashId : () => {
        // eslint-disable-next-line sonarjs/pseudo-random, no-magic-numbers
        return Math.random().toString(16).slice(2)
    }
}

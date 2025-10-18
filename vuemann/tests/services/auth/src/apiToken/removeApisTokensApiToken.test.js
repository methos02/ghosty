import { describe, it, expect, vi, beforeEach } from 'vitest'
import { apiToken } from '@brugmann/vuemann/src/services/auth/src/models/api-token.js'
import { ConfigLoader } from '@brugmann/vuemann/src/config/config-loader.js'

describe('removeApisTokens', () => {

    beforeEach(() => {
        vi.spyOn(ConfigLoader, 'get')
        vi.spyOn(apiToken, 'removeApisTokens')
        vi.spyOn(apiToken, 'removeTokens')
        vi.clearAllMocks()
    })

    it('doit appeler removeTokens uniquement pour les APIs avec auth à true', () => {
        ConfigLoader.get.mockReturnValue({
            apiA: { auth: true },
            apiB: { auth: false },
            apiC: { auth: true },
        })

        apiToken.removeApisTokens()

        expect(apiToken.removeTokens).toHaveBeenCalledTimes(2)
        expect(apiToken.removeTokens).toHaveBeenCalledWith('apiA')
        expect(apiToken.removeTokens).toHaveBeenCalledWith('apiC')
        expect(apiToken.removeTokens).not.toHaveBeenCalledWith('apiB')
    })

    it('ne doit rien appeler si aucune API avec auth à true', () => {
        ConfigLoader.get.mockReturnValue({
            apiX: { auth: false },
            apiY: { auth: false },
        })

        apiToken.removeApisTokens()

        expect(apiToken.removeTokens).not.toHaveBeenCalled()
    })
})

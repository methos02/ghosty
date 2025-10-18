import { authStore } from '@brugmann/vuemann/src/services/auth/auth-store.js'
import { describe, it, expect, vi, beforeEach, beforeAll } from 'vitest'
import { authFunctions } from '@brugmann/vuemann/src/services/auth/src/auth-functions.js'
import { createPinia, setActivePinia } from 'pinia'
import { apiToken } from '@brugmann/vuemann/src/services/auth/src/models/api-token.js'
import { currentUser } from '@brugmann/vuemann/src/services/auth/src/models/current-user.js'

describe('generateError', () => {
    const mockAuthStore = { errorAuth: null }

    beforeAll(() => {
        setActivePinia(createPinia())
    })

    beforeEach(() => {
        localStorage.clear()
        vi.clearAllMocks()
    })

    it('devrait définir errorAuth, appeler les fonctions de nettoyage et retourner false', () => {
        apiToken.setTokens('api', 'token', 'refresh')
        currentUser.set('JOEDOE')

        vi.spyOn(apiToken, 'removeApisTokens')
        vi.spyOn(currentUser, 'remove')

        expect(localStorage.getItem('api_token')).toBe('token')
        expect(localStorage.getItem('api_refresh')).toBe('refresh')

        expect(authStore.get().currentUser).toBe('JOEDOE')
        expect(localStorage.getItem('current_user')).toBe('JOEDOE')

        const result = authFunctions.generateError('unauthorized')

        expect(authStore.get().errorAuth).toBe('unauthorized')

        expect(apiToken.removeApisTokens).toHaveBeenCalled()
        expect(localStorage.getItem('api_token')).toBeNull()
        expect(localStorage.getItem('api_refresh')).toBeNull()
        
        expect(currentUser.remove).toHaveBeenCalled()
        expect(authStore.get().currentUser).toBeUndefined()
        expect(localStorage.getItem('current_user')).toBeNull()

        expect(result).toBe(false)
    })
})

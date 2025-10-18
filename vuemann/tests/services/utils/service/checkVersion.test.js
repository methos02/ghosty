import { describe, it, expect, vi } from 'vitest'
import { utilsService } from '@brugmann/vuemann/src/services/utils/init/utils-service.js'

describe('needUpdate', () => {
    it('should return false if the version are the same', async () => {
        global.fetch = vi.fn().mockResolvedValue({
            json: () => Promise.resolve({ version: '1.2.3' })
        })

        const version = '1.2.3'
        const result = await utilsService.needUpdate(version)
        expect(result).toBe(false)
    })

    it('should return true if the version are different', async () => {
        global.fetch = vi.fn().mockResolvedValue({
            json: () => Promise.resolve({ version: '1.2.3' })
        })

        const version = '1.2.4'
        const result = await utilsService.needUpdate(version)
        expect(result).toBe(true)
    })
})

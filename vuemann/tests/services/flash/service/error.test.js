import { describe, it, expect, vi, beforeEach, beforeAll } from 'vitest';
import { useFlashStore } from '@brugmann/vuemann/src/services/flash/src/flash-store.js';
import { flashService } from '@brugmann/vuemann/src/services/flash/init/flash-service.js';
import {createPinia, setActivePinia} from "pinia";

describe('flash service error', () => {
    beforeAll(() => setActivePinia(createPinia()))

    it('devrait ajouter un message d\'erreur dans le flashStore et appeler console.error', () => {
        const flashStore = useFlashStore();
        const mockMessage = 'Une erreur est survenue';
        vi.spyOn(console, 'error').mockImplementation(() => {});

        const res = flashService.error(mockMessage);

        expect(res).toBe(false)
        expect(flashStore.flashes[0].content).toBe(mockMessage);
        expect(flashStore.flashes[0].type).toBe('error');
        expect(console.error).toHaveBeenCalledWith(mockMessage);

        vi.resetAllMocks()
    });
});

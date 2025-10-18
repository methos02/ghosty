import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useFlashStore } from '@brugmann/vuemann/src/services/flash/src/flash-store.js';
import { flashService } from '@brugmann/vuemann/src/services/flash/init/flash-service.js';
import {createPinia, setActivePinia} from "pinia";

describe('flash service success', () => {
    beforeEach(() => setActivePinia(createPinia()) )

    it('devrait ajouter un message d\'erreur dans le flashStore et appeler console.error', () => {
        const mockMessage = 'Message de success';

        flashService.success(mockMessage);

        const flashStore = useFlashStore();

        expect(flashStore.flashes[0].content).toBe(mockMessage);
        expect(flashStore.flashes[0].type).toBe('success');
    });
});

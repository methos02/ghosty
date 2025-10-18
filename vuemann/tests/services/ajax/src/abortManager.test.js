import { describe, it, expect, beforeEach } from 'vitest';
import { abortManager } from '@brugmann/vuemann/src/services/ajax/src/models/abort-manager.js';

describe('abort-manager.js', () => {
    beforeEach(() => {
        // Réinitialise l'abortController avant chaque test
        abortManager.setAbort(undefined);
    });

    it('should not create an AbortController if setAbort is called with undefined', () => {
        abortManager.setAbort(undefined);
        expect(abortManager.getAbort()).toBeUndefined();
    });

    it('should create a new AbortController if setAbort is called with a value', () => {
        abortManager.setAbort(true);
        expect(abortManager.getAbort()).toBeInstanceOf(AbortController);
    });

    it('should abort the previous AbortController when a new one is set', () => {
        abortManager.setAbort(true);
        const firstController = abortManager.getAbort();

        abortManager.setAbort(true);
        const secondController = abortManager.getAbort();

        expect(firstController.signal.aborted).toBe(true);
        expect(secondController.signal.aborted).toBe(false);
        expect(firstController).not.toBe(secondController);
    });

    it('should return the correct abort signal', () => {
        abortManager.setAbort(true);
        const controller = abortManager.getAbort();

        expect(abortManager.abortSignal()).toBe(controller.signal);
    });
});

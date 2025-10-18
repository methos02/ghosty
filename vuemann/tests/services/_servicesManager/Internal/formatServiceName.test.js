import { describe, it, expect } from 'vitest';
import { sericesManagerInternal } from '@brugmann/vuemann/src/services/services-manager.js';

describe('formatServiceName', () => {
    it('should return the same name if it already ends with "Service"', () => {
        expect(sericesManagerInternal.formatServiceName('UserService')).toBe('UserService');
    });

    it('should append "Service" if the name does not end with it', () => {
        expect(sericesManagerInternal.formatServiceName('User')).toBe('UserService');
    });
});

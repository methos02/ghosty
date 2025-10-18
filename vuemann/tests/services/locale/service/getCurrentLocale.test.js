import { describe, it, expect } from 'vitest';
import { localeService } from '@brugmann/vuemann/src/services/locale/init/locale-service.js';

describe('getCurrentLocale', () => {
    it('should return the locale from localStorage if it exists', () => {
        localStorage.setItem('locale', 'en');

        const result = localeService.getCurrentLocale();
        expect(result).toBe('en');

        localStorage.clear();
    });

    it('should set and return the default locale if not found in localStorage', () => {
        const result =  localeService.getCurrentLocale();

        expect(result).toBe('fr');
    });
});

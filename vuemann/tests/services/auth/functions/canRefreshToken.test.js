import { authFunctions } from '@brugmann/vuemann/src/services/auth/src/auth-functions.js';
import { describe, it, expect } from 'vitest';

describe('canRefreshToken', () => {
    for(const status of [200, 400, 403, 404, 422, 500]) {  
        it(`should return false if status is not ${status}`, () => {
            expect(authFunctions.canRefreshToken({ status, data: { detail: 'Token expired' }})).toBe(false);
        });
    }

    it('should return false if data is undefined, even with 401 status', () => {
        expect(authFunctions.canRefreshToken({ status: 401 })).toBe(false);
    });

    it('should return false if no details even with 401 status', () => {
        expect(authFunctions.canRefreshToken({ status: 401, data : { error : 'error test'} })).toBe(false);
    });

    it('should return false if detail does not include "expired"', () => {
        expect(authFunctions.canRefreshToken({ status: 401, data: { detail: 'some other error' }})).toBe(false);
    });

    it('should return true if status is 401 and detail includes "expired"', () => {
        expect(authFunctions.canRefreshToken({ status: 401, data: { detail: 'Token expired' }})).toBe(true);
    });
    
    it('should return false if detail is a non-string/non-array type', () => {
        expect(authFunctions.canRefreshToken({ status: 401, detail: null })).toBe(false);
        expect(authFunctions.canRefreshToken({ status: 401, detail: 123 })).toBe(false);
        expect(authFunctions.canRefreshToken({ status: 401, detail: { message: 'expired' } })).toBe(false);
    });
});

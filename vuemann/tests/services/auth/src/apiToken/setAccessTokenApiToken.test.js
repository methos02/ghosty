import { apiToken } from '@brugmann/vuemann/src/services/auth/src/models/api-token.js';
import { describe, it, expect, beforeEach } from 'vitest';


describe('LocalStorage Token Management', () => {
  const api = 'api';
  const accessToken = 'access_token';

  beforeEach(() =>localStorage.clear())

  it('should set access token', () => {
    apiToken.setAccessToken(api, accessToken);
    expect(localStorage.getItem(`${api}_token`)).toBe(accessToken)
  });
});

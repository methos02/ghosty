import { apiToken } from '@brugmann/vuemann/src/services/auth/src/models/api-token.js';
import { describe, it, expect, beforeEach } from 'vitest';

describe('LocalStorage Token Management', () => {
  const api = 'api';
  const accessToken = 'access_token';
  const refreshToken = 'refresh_token';

  beforeEach(() =>localStorage.clear())

  it('should set access token', () => {
    apiToken.setAccessToken(api, accessToken);
    expect(localStorage.getItem(`${api}_token`)).toBe(accessToken)
  });

  it('should set both access and refresh tokens', () => {
    apiToken.setTokens(api, accessToken, refreshToken);

    expect(localStorage.getItem(`${api}_token`)).toBe(accessToken)
    expect(localStorage.getItem(`${api}_refresh`)).toBe(refreshToken)
  });

  it('should get refresh token', () => {
    apiToken.setTokens(api, accessToken, refreshToken);

    expect(apiToken.getRefreshToken(api)).toBe(refreshToken);
  });

  it('should get access token', () => {
    apiToken.setTokens(api, accessToken, refreshToken);

    expect(apiToken.getAccessToken(api)).toBe(accessToken);
  });

  it('should remove tokens', () => {
    apiToken.setTokens(api, accessToken, refreshToken);

    expect(localStorage.getItem(`${api}_token`)).toBe(accessToken)
    expect(localStorage.getItem(`${api}_refresh`)).toBe(refreshToken)

    apiToken.removeTokens(api);
    expect(localStorage.getItem(`${api}_token`)).toBeNull()
    expect(localStorage.getItem(`${api}_refresh`)).toBeNull()
  });
});

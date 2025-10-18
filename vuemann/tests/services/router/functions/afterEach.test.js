import { describe, it, expect, vi, beforeEach } from 'vitest';
import { routerFunctions } from '@brugmann/vuemann/src/services/router/src/router-functions.js';

describe('updatePageTitle', () => {
    beforeEach(() => document.title = "vuemann")

  it('should update document title when meta title is present', () => {
    const to = { meta: { title: 'Nouveau Titre' } };

    const res = routerFunctions.afterEach(to);

    expect(res).toBeTruthy()
    expect(document.title).toBe('Nouveau Titre');
  });

  it('should not update document title when meta title is absent', () => {
    const to = { meta: {} };

    const res = routerFunctions.afterEach(to);

    expect(res).toBeFalsy()
    expect(document.title).toBe('vuemann');
  });

  it('should not update document title when meta is absent', () => {
    const to = {};

    const res = routerFunctions.afterEach(to);

    expect(res).toBeFalsy()
    expect(document.title).toBe('vuemann');
  });
});

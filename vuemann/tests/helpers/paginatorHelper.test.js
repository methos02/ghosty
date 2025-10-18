import { describe, it, expect } from 'vitest';
import { paginatorHelper } from '@brugmann/vuemann/src/helpers/paginator-helper.js';

describe('paginator-helper.js', () => {
  describe('calculTotalPage', () => {
    it('calculates the total number of pages correctly', () => {
      // Cas général
      expect(paginatorHelper.calculTotalPage(50, 10)).toBe(5);
      // Quand le totalItems est un multiple exact de limit
      expect(paginatorHelper.calculTotalPage(100, 25)).toBe(4);
      // Quand il reste des éléments (non divisible)
      expect(paginatorHelper.calculTotalPage(55, 10)).toBe(6);
      // Quand il n'y a aucun élément
      expect(paginatorHelper.calculTotalPage(0, 10)).toBe(0);
      // Cas limite avec limit = 1
      expect(paginatorHelper.calculTotalPage(5, 1)).toBe(5);
    });
  });
});

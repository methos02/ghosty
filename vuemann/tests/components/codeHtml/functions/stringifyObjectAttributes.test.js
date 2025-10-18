import { describe, it, expect } from 'vitest';
import { codeHtml } from '@brugmann/vuemann/src/components/codeHtml/code-html-functions.js';

describe('stringifyObjectAttributes', () => {
  it('should return correct string for a single property object', () => {
    const key = 'style';
    const value = { width: '125px' };

    expect(codeHtml.stringifyObjectAttributes(key, value)).toBe('style="width:125px;"');
  });

  it('should return correct string for multiple properties', () => {
    const key = 'style';
    const value = { width: '125px', height: '100px' };

    expect(codeHtml.stringifyObjectAttributes(key, value)).toBe('style="width:125px; height:100px;"');
  });

  it('should return an empty string for empty object values', () => {
    const key = 'style';
    const value = {};

    expect(codeHtml.stringifyObjectAttributes(key, value)).toBe('style=""');
  });

  it('should work with different keys', () => {
    const key = 'data';
    const value = { id: 'test', value: 'hello' };

    expect(codeHtml.stringifyObjectAttributes(key, value)).toBe('data="id:test; value:hello;"');
  });

  it('should convert numeric values to string correctly', () => {
    const key = 'style';
    const value = { width: 125, height: 100 };

    expect( codeHtml.stringifyObjectAttributes(key, value)).toBe('style="width:125; height:100;"');
  });
});

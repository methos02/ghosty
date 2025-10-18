import { localeFunctions } from '@brugmann/vuemann/src/services/locale/src/locale-functions.js';
import { describe, it, expect } from 'vitest';
import { localeService } from '@brugmann/vuemann/src/services/locale/init/locale-service.js';

describe('t', () => {
  it('should handle empty params correctly', () => {
    localeFunctions.getTranslater().global.mergeLocaleMessage('fr', { test_translate: 'test translation'})
    const res = localeService.t('test_translate', {});

    expect(res).toBe('test translation')
  })

  it('should passe params', () => {
    localeFunctions.getTranslater().global.mergeLocaleMessage('fr', { test_translate: 'test translation {param}'})
    const res = localeService.t('test_translate', {param : 'value'});

    expect(res).toBe('test translation value')
  })

  it('should extract params and call the translator when ":" is present', () => {
    localeFunctions.getTranslater().global.mergeLocaleMessage('fr', { test_translate: 'test translation {inline_param}'})
    const res = localeService.t('test_translate:inline_param=value', {});

    expect(res).toBe('test translation value')
  })
});

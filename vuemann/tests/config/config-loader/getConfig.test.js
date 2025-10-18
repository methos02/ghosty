import { describe, it, expect, beforeEach, afterEach, afterAll } from 'vitest'
import { ConfigLoader } from '@brugmann/vuemann/src/config/config-loader.js';
import { app } from '@brugmann/vuemann/src/config/app-config.js';
import { routesApi } from '@brugmann/vuemann/src/config/routes-api-config.js';

describe('config module', () => {
    beforeEach(() => {
      ConfigLoader.init({ locales: ['fr', 'nl'], app: { name: 'TestApp' } })
    })

    afterAll(() => {
      ConfigLoader.init({app: app, routesApi})
    })

    it('get() should return top-level config value', () => {
        expect(ConfigLoader.get('locales')).toEqual(['fr', 'nl'])
      })
    
      it('get() should return nested config value', () => {
        expect(ConfigLoader.get('app.name')).toBe('TestApp')
      })
    
      it('get() should return default value if key is missing', () => {
        expect(ConfigLoader.get('app.version', '1.0.0')).toBe('1.0.0')
      })
    
      it('get() should return false if nested key is missing', () => {
        expect(ConfigLoader.get('app.missing.key')).toBeUndefined()
      })
})

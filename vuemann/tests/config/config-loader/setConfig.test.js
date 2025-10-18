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

    it('set() should update top-level config', () => {
      ConfigLoader.set('locales', ['de'])
      expect(ConfigLoader.get('locales')).toEqual(['de'])
    })
  
    it('set() should create and set nested config values', () => {
      ConfigLoader.set('auth.token', 'abc123')
      expect(ConfigLoader.get('auth.token')).toBe('abc123')
    })
  
    it('set() should create and set nested config values', () => {
      ConfigLoader.set('app.auth', false)
      expect(ConfigLoader.get('app.auth')).toBe(false)

      ConfigLoader.set('app.auth', 'test')
      expect(ConfigLoader.get('app.auth')).toBe('test')

      ConfigLoader.set('app.auth', undefined)
      expect(ConfigLoader.get('app.auth')).toBe(undefined)
    })
})

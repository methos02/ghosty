import { describe, it, expect, beforeAll } from 'vitest'
import { ajaxService } from '@/services/ajax/ajax-service.js'
import { ConfigLoader } from '@/config/config-loader.js'

describe('ajax-service', () => {
  beforeAll(() => {
    ConfigLoader.set('app.apis.ghosty.url', 'http://ghosty.test/')
  })

  describe('generateUrlFromRouteName', () => {
    it('builds the URL from the api base and the route path', () => {
      expect(ajaxService.generateUrlFromRouteName('novel.list')).toBe(
        'http://ghosty.test/v1/novels',
      )
    })

    it('injects path parameters into the URL', () => {
      expect(ajaxService.generateUrlFromRouteName('novel.show', { slug: 'mon-roman' })).toBe(
        'http://ghosty.test/v1/novels/mon-roman',
      )
    })

    it('appends non-path parameters as a query string', () => {
      expect(ajaxService.generateUrlFromRouteName('novel.list', { page: 2 })).toBe(
        'http://ghosty.test/v1/novels?page=2',
      )
    })
  })
})

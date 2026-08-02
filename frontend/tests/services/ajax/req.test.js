import { describe, it, expect, beforeAll, afterEach, vi } from 'vitest'
import { ajaxService } from '@/services/ajax/ajax-service.js'
import { httpClient } from '@/services/ajax/src/models/http-client.js'
import { ConfigLoader } from '@/config/config-loader.js'
import { novelSeeder } from '&/utils/seeders/novel-seeder.js'
import { paginationSeeder } from '&/utils/seeders/pagination-seeder.js'

// Normalized response as the http client returns it to req()
const httpResponse = (data, status = 200) => ({ data, status, headers: {}, statusText: 'OK' })

describe('ajax-service', () => {
  beforeAll(() => {
    ConfigLoader.set('app.apis.ghosty.url', 'http://ghosty.test/')
  })

  afterEach(() => {
    vi.restoreAllMocks()
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

  describe('req', () => {
    it('routes a GET through the http client and tags the response with api + route', async () => {
      const get = vi
        .spyOn(httpClient, 'get')
        .mockResolvedValue(
          httpResponse({ data: novelSeeder.getNovelsApi(2), meta: paginationSeeder.getMetaApi() }),
        )

      const response = await ajaxService.req('novel.list', { params: { page: 1 } })

      expect(get).toHaveBeenCalledOnce()
      expect(response).toMatchObject({ api: 'ghosty', route: 'novel.list', status: 200 })
      expect(response.data.data).toHaveLength(2)
    })

    it('routes a POST through the http client post method', async () => {
      const post = vi.spyOn(httpClient, 'post').mockResolvedValue(httpResponse({ id: 10 }))

      const response = await ajaxService.req('auth.login', { body: { title: 'Chapitre' } })

      expect(post).toHaveBeenCalledOnce()
      expect(response).toMatchObject({ api: 'ghosty', route: 'auth.login', status: 200 })
      expect(response.data.id).toBe(10)
    })

    it('passes the http client status through to the caller', async () => {
      vi.spyOn(httpClient, 'get').mockResolvedValue(httpResponse({ error: 'boom' }, 500))

      const response = await ajaxService.req('novel.list', { params: { page: 1 } })

      expect(response.status).toBe(500)
    })
  })
})

import { describe, it, expect } from 'vitest'
import { ajaxFunctionsInternal } from '@/services/ajax/src/ajax-functions.js'

describe('ajax-functions.getRouteFromConfig', () => {
  it('resolves a declared route and tags it with its name', () => {
    const route = ajaxFunctionsInternal.getRouteFromConfig('novel.show')

    expect(route).toMatchObject({
      url: 'v1/novels/{slug}',
      method: 'get',
      api: 'ghosty',
      name: 'novel.show',
    })
  })

  it('resolves a POST route', () => {
    const route = ajaxFunctionsInternal.getRouteFromConfig('auth.login')

    expect(route).toMatchObject({
      url: 'v1/auth/login',
      method: 'post',
      api: 'ghosty',
      name: 'auth.login',
    })
  })

  it('returns false for an unknown route', () => {
    expect(ajaxFunctionsInternal.getRouteFromConfig('does.not.exist')).toBe(false)
  })
})

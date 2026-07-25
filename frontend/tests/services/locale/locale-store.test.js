import { describe, it, expect, afterEach } from 'vitest'
import { localeStore, useLocaleStore } from '@/services/locale/src/locale-store.js'

describe('locale-store', () => {
  afterEach(() => {
    localeStore.set('fr')
  })

  it('get returns the current locale', () => {
    localeStore.set('en')

    expect(localeStore.get()).toBe('en')
  })

  it('set updates the locale and persists it to localStorage', () => {
    localeStore.set('en')

    expect(localStorage.getItem('locale')).toBe('en')
  })

  it('exposes a readonly reactive ref through useLocaleStore', () => {
    const { currentRef } = useLocaleStore()

    localeStore.set('en')

    expect(currentRef.value).toBe('en')
  })
})

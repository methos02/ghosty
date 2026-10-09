import { describe, it, expect, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { useWindowScrolled } from '@/core-vue/composables/use-window-scrolled.js'

describe('use-window-scrolled', () => {
  describe('useWindowScrolled', () => {
    afterEach(() => {
      Object.defineProperty(globalThis, 'scrollY', { value: 0, configurable: true })
    })

    it('reports nothing while the page sits at the top', () => {
      let composable
      mount({
        template: '<div />',
        setup() {
          composable = useWindowScrolled()
          return {}
        },
      })

      expect(composable.isScrolled.value).toBe(false)
    })

    it('reports the page has moved once the reader scrolls past the threshold', () => {
      let composable
      mount({
        template: '<div />',
        setup() {
          composable = useWindowScrolled(10)
          return {}
        },
      })

      Object.defineProperty(globalThis, 'scrollY', { value: 40, configurable: true })
      globalThis.dispatchEvent(new Event('scroll'))

      expect(composable.isScrolled.value).toBe(true)
    })

    it('stays quiet inside the threshold', () => {
      let composable
      mount({
        template: '<div />',
        setup() {
          composable = useWindowScrolled(10)
          return {}
        },
      })

      Object.defineProperty(globalThis, 'scrollY', { value: 4, configurable: true })
      globalThis.dispatchEvent(new Event('scroll'))

      expect(composable.isScrolled.value).toBe(false)
    })

    it('stops listening once the page is left', () => {
      let composable
      const wrapper = mount({
        template: '<div />',
        setup() {
          composable = useWindowScrolled(10)
          return {}
        },
      })

      wrapper.unmount()
      Object.defineProperty(globalThis, 'scrollY', { value: 400, configurable: true })
      globalThis.dispatchEvent(new Event('scroll'))

      expect(composable.isScrolled.value).toBe(false)
    })
  })
})

import { describe, it, expect, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { useWindowScrolled } from '@/core-vue/composables/use-window-scrolled.js'

const scrollTo = offset => {
  Object.defineProperty(globalThis, 'scrollY', { value: offset, configurable: true })
  globalThis.dispatchEvent(new Event('scroll'))
}

describe('use-window-scrolled', () => {
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

    scrollTo(40)

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

    scrollTo(4)

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
    scrollTo(400)

    expect(composable.isScrolled.value).toBe(false)
  })
})

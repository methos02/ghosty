import { describe, it, expect, vi, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import HeaderSideMenu from '@/views/layout/HeaderSideMenu.vue'
import { auth } from '@/services/shortcuts/services-shortcut.js'

describe('HeaderSideMenu.vue', () => {
  let wrapper

  const openedMenu = async () => {
    wrapper = mount(HeaderSideMenu)
    await wrapper.find('.header-burger').trigger('click')
    return wrapper
  }

  const isOpen = () => wrapper.find('.header-side').classes('header-side--open')

  afterEach(() => {
    vi.clearAllMocks()
    wrapper?.unmount()
    wrapper = undefined
  })

  it('leaves the panel closed until the burger is clicked', () => {
    wrapper = mount(HeaderSideMenu)

    expect(isOpen()).toBe(false)
  })

  it('opens the panel when the burger is clicked', async () => {
    await openedMenu()

    expect(isOpen()).toBe(true)
  })

  it('closes the panel when the burger is clicked a second time', async () => {
    await openedMenu()

    await wrapper.find('.header-burger').trigger('click')

    expect(isOpen()).toBe(false)
  })

  it('closes the panel when the backdrop is clicked', async () => {
    await openedMenu()

    await wrapper.find('.header-side__backdrop').trigger('click')

    expect(isOpen()).toBe(false)
  })

  it('closes the panel when Escape is pressed', async () => {
    await openedMenu()

    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }))
    await nextTick()

    expect(isOpen()).toBe(false)
  })

  it('closes the panel when a menu entry is followed', async () => {
    await openedMenu()

    await wrapper.find('.header-create').trigger('click')

    expect(isOpen()).toBe(false)
  })

  it('closes the panel when logging out', async () => {
    vi.spyOn(auth, 'logout').mockResolvedValue({ status: 200 })
    await openedMenu()

    await wrapper.find('.header-logout').trigger('click')

    expect(isOpen()).toBe(false)
  })

  it('reports the panel state to assistive technology', async () => {
    await openedMenu()

    expect(wrapper.find('.header-burger').attributes('aria-expanded')).toBe('true')
    expect(wrapper.find('.header-side__panel').attributes('aria-hidden')).toBe('false')
  })
})

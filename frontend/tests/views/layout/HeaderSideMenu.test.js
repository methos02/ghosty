import { describe, it, expect, vi, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import HeaderSideMenu from '@/views/layout/HeaderSideMenu.vue'
import { auth } from '@/services/shortcuts/services-shortcut.js'
import { useAuthStore } from '@/services/auth/src/auth-store.js'
import { userSeeder } from '&/utils/seeders/user-seeder.js'

describe('HeaderSideMenu.vue', () => {
  let wrapper

  const isOpen = () => wrapper.find('.header-side').classes('header-side--open')

  afterEach(() => {
    vi.clearAllMocks()
    useAuthStore().clear()
    wrapper?.unmount()
    wrapper = undefined
  })

  it('leaves the panel closed until the burger is clicked', () => {
    wrapper = mount(HeaderSideMenu)

    expect(isOpen()).toBe(false)
  })

  it('opens the panel when the burger is clicked', async () => {
    wrapper = mount(HeaderSideMenu)

    await wrapper.find('.header-burger').trigger('click')

    expect(isOpen()).toBe(true)
  })

  it('closes the panel when the burger is clicked a second time', async () => {
    wrapper = mount(HeaderSideMenu)
    await wrapper.find('.header-burger').trigger('click')

    await wrapper.find('.header-burger').trigger('click')

    expect(isOpen()).toBe(false)
  })

  it('closes the panel when the backdrop is clicked', async () => {
    wrapper = mount(HeaderSideMenu)
    await wrapper.find('.header-burger').trigger('click')

    await wrapper.find('.header-side__backdrop').trigger('click')

    expect(isOpen()).toBe(false)
  })

  it('closes the panel when Escape is pressed', async () => {
    wrapper = mount(HeaderSideMenu)
    await wrapper.find('.header-burger').trigger('click')

    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }))
    await nextTick()

    expect(isOpen()).toBe(false)
  })

  it('closes the panel when a menu entry is followed', async () => {
    wrapper = mount(HeaderSideMenu)
    await wrapper.find('.header-burger').trigger('click')

    await wrapper.find('.header-create').trigger('click')

    expect(isOpen()).toBe(false)
  })

  it('closes the panel when logging out', async () => {
    vi.spyOn(auth, 'logout').mockResolvedValue({ status: 200 })
    wrapper = mount(HeaderSideMenu)
    await wrapper.find('.header-burger').trigger('click')

    await wrapper.find('.header-logout').trigger('click')

    expect(isOpen()).toBe(false)
  })

  it('reports the panel state to assistive technology', async () => {
    wrapper = mount(HeaderSideMenu)

    await wrapper.find('.header-burger').trigger('click')

    expect(wrapper.find('.header-burger').attributes('aria-expanded')).toBe('true')
    expect(wrapper.find('.header-side__panel').attributes('aria-hidden')).toBe('false')
  })

  it('leads a moderator to the moderation queue', () => {
    useAuthStore().setUser(userSeeder.getUser({ roles: ['moderator'] }))

    wrapper = mount(HeaderSideMenu)

    expect(wrapper.findComponent('.header-moderation').props('to')).toEqual({ name: 'moderation' })
  })

  it('leads an admin to the moderation queue', () => {
    useAuthStore().setUser(userSeeder.getUser({ roles: ['admin'] }))

    wrapper = mount(HeaderSideMenu)

    expect(wrapper.find('.header-moderation').exists()).toBe(true)
  })

  it('hides the moderation queue from a reader', () => {
    useAuthStore().setUser(userSeeder.getUser())

    wrapper = mount(HeaderSideMenu)

    expect(wrapper.find('.header-moderation').exists()).toBe(false)
  })
})

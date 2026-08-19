import { describe, it, expect, vi, afterEach } from 'vitest'
import { mount, shallowMount } from '@vue/test-utils'
import HeaderComponent from '@/views/layout/HeaderComponent.vue'
import { useAuthStore } from '@/services/auth/src/auth-store.js'
import { useAuth } from '@/services/auth/src/use-auth.js'
import { auth } from '@/services/shortcuts/services-shortcut.js'

describe('HeaderComponent.vue', () => {
  afterEach(() => {
    useAuthStore().clear()
    useAuth().closeDialogs()
    vi.restoreAllMocks()
  })

  describe('when not authenticated', () => {
    it('shows the login and register buttons', () => {
      useAuthStore().clear()
      const wrapper = shallowMount(HeaderComponent)

      const labels = wrapper.findAll('.btn-auth').map(button => button.text())
      expect(labels).toEqual(['Connexion', 'Inscription'])
    })

    it('opens the login dialog when clicking "Connexion"', async () => {
      useAuthStore().clear()
      const wrapper = shallowMount(HeaderComponent)

      await wrapper.findAll('.btn-auth')[0].trigger('click')

      expect(useAuth().showLoginDialog.value).toBe(true)
    })

    it('opens the register dialog when clicking "Inscription"', async () => {
      useAuthStore().clear()
      const wrapper = shallowMount(HeaderComponent)

      await wrapper.findAll('.btn-auth')[1].trigger('click')

      expect(useAuth().showRegisterDialog.value).toBe(true)
    })

    it('offers no menu', () => {
      useAuthStore().clear()
      const wrapper = mount(HeaderComponent)

      expect(wrapper.find('.header-menu').exists()).toBe(false)
    })
  })

  describe('when authenticated', () => {
    it('replaces the buttons with the username and a menu', () => {
      useAuthStore().setUser({ username: 'GhostWriter' })

      const wrapper = mount(HeaderComponent)

      expect(wrapper.find('.header-username').text()).toBe('GhostWriter')
      expect(wrapper.find('.header-menu').exists()).toBe(true)
      expect(wrapper.findAll('.btn-auth')).toHaveLength(0)
    })

    it('gathers writing, drafts and favorites in the menu', () => {
      useAuthStore().setUser({ username: 'GhostWriter' })

      const wrapper = mount(HeaderComponent)

      expect(wrapper.findComponent('.header-create').props('to')).toEqual({ name: 'novel-create' })
      expect(wrapper.findComponent('.header-drafts').props('to')).toEqual({ name: 'drafts' })
      expect(wrapper.findComponent('.header-favorites').props('to')).toEqual({ name: 'favorites' })
    })

    it('tints the bar while the side menu is open', async () => {
      useAuthStore().setUser({ username: 'GhostWriter' })

      const wrapper = mount(HeaderComponent)
      await wrapper.find('.header-burger').trigger('click')

      expect(wrapper.find('.header').classes('header--menu-open')).toBe(true)
    })

    it('calls auth.logout from the menu', async () => {
      useAuthStore().setUser({ username: 'GhostWriter' })
      const logout = vi.spyOn(auth, 'logout').mockResolvedValue({ status: 200 })

      const wrapper = mount(HeaderComponent)
      await wrapper.find('.header-logout').trigger('click')

      expect(logout).toHaveBeenCalledOnce()
    })
  })

  it('carries its own background unless the page asks for transparency', () => {
    const opaque = mount(HeaderComponent)
    const overHero = mount(HeaderComponent, { props: { transparent: true } })

    expect(opaque.find('.header').classes()).not.toContain('header--transparent')
    expect(overHero.find('.header').classes()).toContain('header--transparent')
  })
})

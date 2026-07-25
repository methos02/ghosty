import { describe, it, expect, vi, afterEach } from 'vitest'
import { shallowMount } from '@vue/test-utils'
import HeaderComponent from '@/views/layout/HeaderComponent.vue'
import { authStore } from '@/services/auth/src/auth-store.js'
import { useAuth } from '@/services/auth/src/use-auth.js'
import { auth } from '@/services/shortcuts/services-shortcut.js'

describe('HeaderComponent.vue', () => {
  afterEach(() => {
    authStore.clear()
    useAuth().closeDialogs()
    vi.restoreAllMocks()
  })

  describe('when not authenticated', () => {
    it('shows the login and register buttons', () => {
      authStore.clear()
      const wrapper = shallowMount(HeaderComponent)

      const labels = wrapper.findAll('.btn-auth').map(button => button.text())
      expect(labels).toEqual(['Connexion', 'Inscription'])
    })

    it('opens the login dialog when clicking "Connexion"', async () => {
      authStore.clear()
      const wrapper = shallowMount(HeaderComponent)

      await wrapper.findAll('.btn-auth')[0].trigger('click')

      expect(useAuth().showLoginDialog.value).toBe(true)
    })

    it('opens the register dialog when clicking "Inscription"', async () => {
      authStore.clear()
      const wrapper = shallowMount(HeaderComponent)

      await wrapper.findAll('.btn-auth')[1].trigger('click')

      expect(useAuth().showRegisterDialog.value).toBe(true)
    })
  })

  describe('when authenticated', () => {
    it('shows the pseudo and a logout button', () => {
      authStore.setUser({ pseudo: 'GhostWriter' })
      authStore.setToken('jwt-token')

      const wrapper = shallowMount(HeaderComponent)

      expect(wrapper.find('.header-username').text()).toBe('GhostWriter')
      expect(wrapper.find('.btn-auth').text()).toBe('Déconnexion')
    })

    it('calls auth.logout when clicking the logout button', async () => {
      authStore.setUser({ pseudo: 'GhostWriter' })
      authStore.setToken('jwt-token')
      const logout = vi.spyOn(auth, 'logout').mockResolvedValue({ status: 200 })

      const wrapper = shallowMount(HeaderComponent)
      await wrapper.find('.btn-auth').trigger('click')

      expect(logout).toHaveBeenCalledOnce()
    })
  })
})

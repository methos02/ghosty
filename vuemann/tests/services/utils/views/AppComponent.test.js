import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import AppComponent from '@brugmann/vuemann/src/services/utils/views/AppComponent.vue'
import { createPinia, setActivePinia } from 'pinia'
import { utilsStore } from '@brugmann/vuemann/src/services/utils/src/utils-store.js'
import { APP_STATUS } from '@brugmann/vuemann/src/services/utils/utils-constants.js'
import { STATUS } from '@brugmann/vuemann/src/services/ajax/ajax-constants.js'
import { routerService } from '@brugmann/vuemann/src/services/router/init/router-service.js'
import { flashService } from '@brugmann/vuemann/src/services/flash/init/flash-service.js'
import { authService } from '@brugmann/vuemann/src/services/auth/init/auth-service.js'
import { utilsService } from '@brugmann/vuemann/src/services/utils/init/utils-service.js'
import { t } from '@brugmann/vuemann/src/services/services-helper.js'
import { servicesM } from '@brugmann/vuemann/src/services/services-manager.js'
import { ConfigLoader } from '@brugmann/vuemann/src/config/config-loader.js'
import { useRouterStore } from '@brugmann/vuemann/src/services/router/src/router-store.js'
import { windowMock } from '&/utils/mocks/window-mock.js'

describe('AppComponent', () => {
  let wrapper

  beforeEach(() => {
    setActivePinia(createPinia())
    
    vi.useFakeTimers()
    
    Object.defineProperty(globalThis, 'location', {
      value: { reload: vi.fn() },
      writable: true
    })

    Object.defineProperty(document, 'addEventListener', {
      value: vi.fn(),
      writable: true
    })
    
    Object.defineProperty(document, 'removeEventListener', {
      value: vi.fn(),
      writable: true
    })

    Object.defineProperty(window, 'scrollTo', {
      value: vi.fn(),
      writable: true
    })
    
    vi.spyOn(authService, 'routesAuthCheck').mockResolvedValue(true)
    vi.spyOn(utilsService, 'apiStatus').mockReturnValue(true)
    
    // Mock de ConfigLoader - auth activé par défaut
    vi.spyOn(ConfigLoader, 'get').mockImplementation((key) => {
      if (key === 'app.auth') return true
      if (key === 'app.apis') return { api1: { auth: true }, api2: { auth: false } }
      return {}
    })
    
    // Mock de la route courante
    vi.spyOn(routerService, 'currentRoute').mockReturnValue({ value: { name: 'home', fullPath: '/home' } })
    
    // Mock des helpers
    vi.spyOn(flashService, 'error').mockImplementation(() => {})
    vi.spyOn(routerService, 'push').mockResolvedValue(true)
    
    // Mock des événements DOM
    vi.spyOn(document, 'addEventListener').mockImplementation(() => {})
    vi.spyOn(document, 'removeEventListener').mockImplementation(() => {})
  })

  afterEach(() => {
    wrapper?.unmount()
    vi.clearAllMocks()
    vi.useRealTimers()
  })

  const createWrapper = (props = {}) => {
    return mount(AppComponent, { 
        props,
        global: {
          stubs: {
            RouterView: true,
            RouterComponent: true
          }
        }
    });
  };

  describe('Rendu initial', () => {
    it('should render Router when LOADED without callback', async () => {
      wrapper = createWrapper()
      await vi.advanceTimersByTimeAsync(0)

      expect(utilsStore.getAppStatus()).toBe(APP_STATUS.LOADED)
      expect(wrapper.find('#app-container-loaded').exists()).toBe(true)
    })

    it('should show loader when LOADING', async () => {
      utilsStore.setAppStatus(APP_STATUS.LOADING)
      wrapper = createWrapper({ cb: vi.fn().mockImplementation(() => new Promise(() => {})) }) 
      await vi.advanceTimersByTimeAsync(0)

      expect(wrapper.find('#app-container-loader').exists()).toBe(true)
      expect(wrapper.find('.app-loader').exists()).toBe(true)
    })

    it('should show loader when INIT', async () => {
      utilsStore.setAppStatus(APP_STATUS.INIT)
      wrapper = createWrapper({ cb: vi.fn().mockImplementation(() => new Promise(() => {})) }) 
      await vi.advanceTimersByTimeAsync(0)

      expect(wrapper.find('#app-container-loader').exists()).toBe(true)
      expect(wrapper.find('.app-loader').exists()).toBe(true)
    })
  })

  describe('Gestion des callbacks', () => {
    it('should execute callback and show Router when callback resolves with SUCCESS status', async () => {
      const cb = vi.fn().mockResolvedValue({ status: STATUS.SUCCESS })
      wrapper = createWrapper({ cb })
      await vi.advanceTimersByTimeAsync(0)

      expect(cb).toHaveBeenCalledOnce()
      expect(utilsStore.getAppStatus()).toBe(APP_STATUS.LOADED)
      expect(wrapper.find('#app-container-loaded').exists()).toBe(true)
    })

    it('should execute callback and show error when callback resolves with non-SUCCESS status', async () => {
      const cb = vi.fn().mockResolvedValue({ status: STATUS.ERROR_SERVER, error: 'Server error' })
      wrapper = createWrapper({ cb })
      await vi.advanceTimersByTimeAsync(0)

      expect(cb).toHaveBeenCalledOnce()
      expect(utilsStore.getAppStatus()).toBe(APP_STATUS.ERROR)
      expect(wrapper.find('#app-container-error').exists()).toBe(true)
      expect(wrapper.find('#app-container-error button').exists()).toBe(true)
    })

    it('should handle callback that returns undefined', async () => {
      const cb = vi.fn().mockResolvedValue(undefined)
      wrapper = createWrapper({ cb })
      await vi.advanceTimersByTimeAsync(0)

      expect(cb).toHaveBeenCalledOnce()
      expect(utilsStore.getAppStatus()).toBe(APP_STATUS.ERROR)
      expect(flashService.error).toHaveBeenCalledWith(t('app-component.error.callback-undefined'))
    })
  })

  describe('Gestion des erreurs d\'authentification', () => {
    it('should not show error for auth errors', async () => {
      const cb = vi.fn().mockResolvedValue({ status: STATUS.UNAUTHORIZED, error: 'Auth error' })
      wrapper = createWrapper({ cb })
      await vi.advanceTimersByTimeAsync(0)

      expect(cb).toHaveBeenCalledOnce()
      expect(flashService.error).not.toHaveBeenCalled()
      expect(utilsStore.getAppStatus()).toBe(APP_STATUS.LOADED)
    })

    it('should show error for non-auth errors', async () => {
      const cb = vi.fn().mockResolvedValue({ status: STATUS.ERROR_SERVER, error: 'Server error' })
      wrapper = createWrapper({ cb })
      await vi.advanceTimersByTimeAsync(0)

      expect(cb).toHaveBeenCalledOnce()
      expect(flashService.error).toHaveBeenCalledWith('Server error')
      expect(utilsStore.getAppStatus()).toBe(APP_STATUS.ERROR)
    })
  })

  describe('Routes publiques', () => {
    it('should show Router for public routes even when status is ERROR', async () => {
      vi.mocked(routerService.currentRoute).mockReturnValue({ value: { name: 'login' } })
      utilsStore.setAppStatus(APP_STATUS.ERROR)
      wrapper = createWrapper()
      await vi.advanceTimersByTimeAsync(0)

      expect(wrapper.find('#app-container-loaded').exists()).toBe(true)
      expect(wrapper.find('#app-container-error').exists()).toBe(false)
    })

    it('should show Router for changelog route even when status is ERROR', async () => {
      vi.mocked(routerService.currentRoute).mockReturnValue({ value: { name: 'changelog' } })
      utilsStore.setAppStatus(APP_STATUS.ERROR)
      wrapper = createWrapper()
      await vi.advanceTimersByTimeAsync(0)

      expect(wrapper.find('#app-container-loaded').exists()).toBe(true)
      expect(wrapper.find('#app-container-error').exists()).toBe(false)
    })

    it('should show error for non-public routes when status is ERROR', async () => {
      vi.mocked(routerService.currentRoute).mockReturnValue({ value: { name: 'home' } })
      
      const cb = vi.fn().mockResolvedValue({ status: STATUS.ERROR_SERVER })
      wrapper = createWrapper({ cb })
      await vi.advanceTimersByTimeAsync(0)

      expect(wrapper.find('#app-container-loaded').exists()).toBe(false)
      expect(wrapper.find('#app-container-error').exists()).toBe(true)
    })
  })

  describe('Gestion des événements de login', () => {
    it('should add login-success event listener when auth error occurs', async () => {
      const cb = vi.fn().mockResolvedValue({ status: STATUS.UNAUTHORIZED })
      wrapper = createWrapper({ cb })
      await vi.advanceTimersByTimeAsync(0)

      expect(document.addEventListener).toHaveBeenCalledWith('login-success', expect.any(Function))
    })

    it('should remove login-success event listener on unmount', async () => {
      const cb = vi.fn().mockResolvedValue({ status: STATUS.UNAUTHORIZED })
      wrapper = createWrapper({ cb })
      await vi.advanceTimersByTimeAsync(0)

      wrapper.unmount()

      expect(document.removeEventListener).toHaveBeenCalledWith('login-success', expect.any(Function))
    })

    it('should handle successful token refresh correctly', async () => {
      const cb = vi.fn()
        .mockResolvedValueOnce({ status: STATUS.UNAUTHORIZED }) // Première tentative échoue
        .mockResolvedValueOnce({ status: STATUS.SUCCESS }) // Après refresh, ça marche
      
      wrapper = createWrapper({ cb })
      await vi.advanceTimersByTimeAsync(0)

      expect(utilsStore.getAppStatus()).toBe(APP_STATUS.LOADED)
      expect(document.addEventListener).toHaveBeenCalledWith('login-success', expect.any(Function))

      // Simuler le succès du refresh du token
      const loginSuccessHandler = document.addEventListener.mock.calls.find(call => call[0] === 'login-success')[1]
      
      await loginSuccessHandler()
      await vi.advanceTimersByTimeAsync(0)

      expect(utilsStore.getAppStatus()).toBe(APP_STATUS.LOADED)
      expect(document.removeEventListener).toHaveBeenCalledWith('login-success', expect.any(Function))
    })

    it('should keep error state if callback still fails after token refresh', async () => {
      const cb = vi.fn()
        .mockResolvedValueOnce({ status: STATUS.UNAUTHORIZED }) // Première tentative échoue
        .mockResolvedValueOnce({ status: STATUS.ERROR_SERVER }) // Après refresh, ça échoue encore
      
      wrapper = createWrapper({ cb })
      await vi.advanceTimersByTimeAsync(0)

      expect(utilsStore.getAppStatus()).toBe(APP_STATUS.LOADED)

      // Simuler le succès du refresh du token
      const loginSuccessHandler = document.addEventListener.mock.calls.find( call => call[0] === 'login-success' )[1]
      
      await loginSuccessHandler()
      await vi.advanceTimersByTimeAsync(0)
      
      expect(utilsStore.getAppStatus()).toBe(APP_STATUS.ERROR)
      expect(document.removeEventListener).toHaveBeenCalledWith('login-success', expect.any(Function))
    })
  })

  describe('Bouton de retry', () => {
    it('should call location.reload when retry button is clicked', async () => {
      const cb = vi.fn().mockResolvedValue({ status: STATUS.ERROR_SERVER })
      wrapper = createWrapper({ cb })
      await vi.advanceTimersByTimeAsync(0)

      expect(utilsStore.getAppStatus()).toBe(APP_STATUS.ERROR)

      await wrapper.find('#app-container-error button').trigger('click')
      await vi.advanceTimersByTimeAsync(0)

      expect(globalThis.location.reload).toHaveBeenCalledOnce()
    })

    it('should have correct button text and styling', async () => {
      const cb = vi.fn().mockResolvedValue({ status: STATUS.ERROR_SERVER })
      wrapper = createWrapper({ cb })
      await vi.advanceTimersByTimeAsync(0)

      const button = wrapper.find('#app-container-error button')
      expect(button.exists()).toBe(true)
      expect(button.classes()).toContain('btn')
      expect(button.classes()).toContain('btn-primary')
    })
  })

  describe('Messages d\'interface', () => {
    it('should display loading message', async () => {
      utilsStore.setAppStatus(APP_STATUS.LOADING)
      wrapper = createWrapper({ cb: vi.fn().mockImplementation(() => new Promise(() => {})) })
      await vi.advanceTimersByTimeAsync(0)

      expect(wrapper.find('#app-container-loader p').text()).toBe(t('app-component.loading'))
    })

    it('should display error messages', async () => {
      const cb = vi.fn().mockResolvedValue({ status: STATUS.ERROR_SERVER })
      wrapper = createWrapper({ cb })
      await vi.advanceTimersByTimeAsync(0)

      expect(wrapper.find('#app-container-error h2').text()).toBe(t('app-component.error.title'))
      expect(wrapper.find('#app-container-error p').text()).toBe(t('app-component.error.description'))
      expect(wrapper.find('#app-container-error button').text()).toBe(t('app-component.error.retry')) 
    })

    it('should display error icon', async () => {
      const cb = vi.fn().mockResolvedValue({ status: STATUS.ERROR_SERVER })
      wrapper = createWrapper({ cb })
      await vi.advanceTimersByTimeAsync(0)

      expect(wrapper.find('#app-container-error .icon-error').text()).toBe('⚠️')
    })
  })

  describe('Structure du composant', () => {
    it('should have correct container classes', async () => {
      wrapper = createWrapper()
      await vi.advanceTimersByTimeAsync(0)

      expect(wrapper.find('.app-container').classes()).toContain('d-flex')
      expect(wrapper.find('.app-container').classes()).toContain('flex-1')
    })

    it('should have correct loader container classes', async () => {
      utilsStore.setAppStatus(APP_STATUS.LOADING)
      wrapper = createWrapper({ cb: vi.fn().mockImplementation(() => new Promise(() => {})) })
      await vi.advanceTimersByTimeAsync(0)

      expect(wrapper.find('#app-container-loader').classes()).toContain('f-column')
      expect(wrapper.find('#app-container-loader').classes()).toContain('a-center')
      expect(wrapper.find('#app-container-loader').classes()).toContain('j-center')
      expect(wrapper.find('#app-container-loader').classes()).toContain('g-15')
      expect(wrapper.find('#app-container-loader').classes()).toContain('flex-1')
    })

    it('should have correct error container classes', async () => {
      const cb = vi.fn().mockResolvedValue({ status: STATUS.ERROR_SERVER })
      wrapper = createWrapper({ cb })
      await vi.advanceTimersByTimeAsync(0)

      expect(wrapper.find('#app-container-error').classes()).toContain('error-message')
      expect(wrapper.find('#app-container-error').classes()).toContain('f-column')
      expect(wrapper.find('#app-container-error').classes()).toContain('a-center')
      expect(wrapper.find('#app-container-error').classes()).toContain('g-15')
    })
  })

  describe('Validation d\'authentification', () => {
    it('should redirect to login when authentication fails', async () => {
      vi.spyOn(authService, 'routesAuthCheck').mockResolvedValue(false)
      
      wrapper = createWrapper()
      await vi.advanceTimersByTimeAsync(0)
      
      expect(routerService.push).toHaveBeenCalledWith('login')
    })

    it('should save current URL to urlIntented when redirecting to login', async () => {
      vi.spyOn(authService, 'routesAuthCheck').mockResolvedValue(false)
      
      wrapper = createWrapper()
      await vi.advanceTimersByTimeAsync(0)
      
      const routerStore = useRouterStore()
      expect(routerStore.urlIntented).toBe('/home')
    })

    it('should not save URL to urlIntented for public routes', async () => {
      vi.spyOn(authService, 'routesAuthCheck').mockResolvedValue(false)
      
      vi.spyOn(routerService, 'currentRoute').mockReturnValue({ value: { name: 'login', fullPath: '/login' } })
      
      wrapper = createWrapper()
      await vi.advanceTimersByTimeAsync(0)
      
      const routerStore = useRouterStore()
      expect(routerStore.urlIntented).toBe('/') // Valeur par défaut
    })

    it('should continue with callback execution when authentication succeeds', async () => {
      const cb = vi.fn().mockResolvedValue({ status: STATUS.SUCCESS })
      
      wrapper = createWrapper({ cb })
      await vi.advanceTimersByTimeAsync(0)
      
      expect(cb).toHaveBeenCalledOnce()
      expect(utilsStore.getAppStatus()).toBe(APP_STATUS.LOADED)
    })

    it('should skip authentication check when auth is disabled', async () => {
      vi.spyOn(ConfigLoader, 'get').mockImplementation((key) => {
        if (key === 'app.auth') return false
        return {}
      })
      
      const cb = vi.fn().mockResolvedValue({ status: STATUS.SUCCESS })
      
      wrapper = createWrapper({ cb })
      await vi.advanceTimersByTimeAsync(0)
      
      expect(authService.routesAuthCheck).not.toHaveBeenCalledWith(expect.anything())
      expect(cb).toHaveBeenCalledOnce()
    })

    it('should skip authentication check when no APIs require auth', async () => {
      vi.spyOn(ConfigLoader, 'get').mockImplementation((key) => {
        if (key === 'app.auth') return true
        if (key === 'app.apis') return { api1: { auth: false }, api2: { auth: false } }
        return {}
      })
      
      const cb = vi.fn().mockResolvedValue({ status: STATUS.SUCCESS })
      
      wrapper = createWrapper({ cb })
      await vi.advanceTimersByTimeAsync(0)
      
      expect(authService.routesAuthCheck).not.toHaveBeenCalledWith(expect.anything())
      expect(cb).toHaveBeenCalledOnce()
    })

    it('should skip authentication check for public pages', async () => {
      vi.spyOn(routerService, 'currentRoute').mockReturnValue({ value: { name: 'login', fullPath: '/login' } })
      
      const cb = vi.fn().mockResolvedValue({ status: STATUS.SUCCESS })
      
      wrapper = createWrapper({ cb })
      await vi.advanceTimersByTimeAsync(0)
      
      expect(authService.routesAuthCheck).not.toHaveBeenCalledWith(expect.anything())
      expect(cb).toHaveBeenCalledOnce()
    })
  })
})

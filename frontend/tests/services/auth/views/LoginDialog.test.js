import { describe, it, expect, vi, afterEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import LoginDialog from '@/services/auth/views/LoginDialog.vue'
import { useAuth } from '@/services/auth/src/use-auth.js'
import { auth, form, t } from '@/services/shortcuts/services-shortcut.js'
import { STATUS } from '@/constants/ajax-constants.js'

describe('LoginDialog.vue', () => {
  afterEach(() => {
    useAuth().closeDialogs()
    form.clearErrors()
    vi.restoreAllMocks()
  })

  it('opens the dialog when the login dialog flag becomes true', async () => {
    const wrapper = mount(LoginDialog)

    useAuth().openLoginDialog()
    await flushPromises()

    expect(wrapper.find('dialog').element.open).toBe(true)
  })

  it('does not call auth.login when the form is empty', async () => {
    const login = vi.spyOn(auth, 'login').mockResolvedValue({ status: STATUS.SUCCESS })
    const wrapper = mount(LoginDialog)
    useAuth().openLoginDialog()
    await flushPromises()

    await wrapper.find('form').trigger('submit')
    await flushPromises()

    expect(login).not.toHaveBeenCalled()
    expect(form.hasError()).toBe(true)
  })

  it('forwards a username as identifier without asking for an email', async () => {
    const login = vi.spyOn(auth, 'login').mockResolvedValue({ status: STATUS.SUCCESS })
    const wrapper = mount(LoginDialog)
    useAuth().openLoginDialog()
    await flushPromises()

    await wrapper.find('input[name="login.identifier"]').setValue('methos')
    await wrapper.find('input[name="login.password"]').setValue('Secret123!')
    await wrapper.find('form').trigger('submit')
    await flushPromises()

    expect(login).toHaveBeenCalledWith({ identifier: 'methos', password: 'Secret123!' })
    expect(form.hasError()).toBe(false)
  })

  it('calls auth.login with the credentials and closes on success', async () => {
    const login = vi.spyOn(auth, 'login').mockResolvedValue({ status: STATUS.SUCCESS })
    const wrapper = mount(LoginDialog)
    useAuth().openLoginDialog()
    await flushPromises()

    await wrapper.find('input[name="login.identifier"]').setValue('ghost@ghosty.test')
    await wrapper.find('input[name="login.password"]').setValue('Secret123!')
    await wrapper.find('form').trigger('submit')
    await flushPromises()

    expect(login).toHaveBeenCalledWith({ identifier: 'ghost@ghosty.test', password: 'Secret123!' })
    expect(useAuth().showLoginDialog.value).toBe(false)
  })

  it('shows an unauthorized error and keeps the dialog open when auth.login fails', async () => {
    vi.spyOn(auth, 'login').mockResolvedValue({ status: STATUS.UNAUTHORIZED })
    const wrapper = mount(LoginDialog)
    useAuth().openLoginDialog()
    await flushPromises()

    await wrapper.find('input[name="login.identifier"]').setValue('ghost@ghosty.test')
    await wrapper.find('input[name="login.password"]').setValue('Secret123!')
    await wrapper.find('form').trigger('submit')
    await flushPromises()

    expect(useAuth().showLoginDialog.value).toBe(true)
    expect(wrapper.text()).toContain('Pseudo, email ou mot de passe incorrect')
  })

  it('switches to the register dialog', async () => {
    const wrapper = mount(LoginDialog)
    useAuth().openLoginDialog()
    await flushPromises()

    await wrapper.find('.btn-primary-alt').trigger('click')

    expect(useAuth().showRegisterDialog.value).toBe(true)
  })
})

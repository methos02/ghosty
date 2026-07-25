import { describe, it, expect, vi, afterEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import RegisterDialog from '@/services/auth/views/RegisterDialog.vue'
import { useAuth } from '@/services/auth/src/use-auth.js'
import { auth, form } from '@/services/shortcuts/services-shortcut.js'

describe('RegisterDialog.vue', () => {
  afterEach(() => {
    useAuth().closeDialogs()
    form.clearErrors()
    vi.restoreAllMocks()
  })

  it('opens the dialog when the register dialog flag becomes true', async () => {
    const wrapper = mount(RegisterDialog)

    useAuth().openRegisterDialog()
    await flushPromises()

    expect(wrapper.find('dialog').element.open).toBe(true)
  })

  it('does not register when the form is invalid (empty fields)', async () => {
    const register = vi.spyOn(auth, 'register').mockResolvedValue({ status: 200 })
    const wrapper = mount(RegisterDialog)
    useAuth().openRegisterDialog()
    await flushPromises()

    await wrapper.find('form').trigger('submit')
    await flushPromises()

    expect(register).not.toHaveBeenCalled()
    expect(form.hasError()).toBe(true)
  })

  it('switches to the login dialog', async () => {
    const wrapper = mount(RegisterDialog)
    useAuth().openRegisterDialog()
    await flushPromises()

    await wrapper.find('.btn-primary-alt').trigger('click')

    expect(useAuth().showLoginDialog.value).toBe(true)
  })
})

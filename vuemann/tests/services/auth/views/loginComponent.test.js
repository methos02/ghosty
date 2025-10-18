import Login from "@brugmann/vuemann/src/services/auth/views/LoginComponent.vue";
import {describe, expect, it, beforeEach, vi, beforeAll, afterEach} from "vitest";
import {createPinia, setActivePinia} from "pinia";
import { mount } from "@vue/test-utils";
import { authRepository } from "@brugmann/vuemann/src/services/auth/src/repositories/auth-repository.js";
import { localeService } from "@brugmann/vuemann/src/services/locale/init/locale-service.js";
import { routerService } from "@brugmann/vuemann/src/services/router/init/router-service.js";

describe('login component', () => {
  beforeEach(() => setActivePinia(createPinia()) )

  afterEach(() => vi.clearAllMocks())

  it('missing password', async () => {
    vi.spyOn(authRepository, 'getToken')
    vi.spyOn(localeService, 't')

    const wrapper = mount(Login)

    await wrapper.find('#username').setValue('DOEJOHN')
    await wrapper.find('#login-form').trigger('submit')

    expect(wrapper.find('#login-error').exists()).toBe(true)
    expect(authRepository.getToken).not.toBeCalled()
    expect(localeService.t).toHaveBeenCalledWith('login_error_credentials', {})
  })

  it('missing username', async () => {
    vi.spyOn(authRepository, 'getToken')
    vi.spyOn(localeService, 't')

    const wrapper = mount(Login)

    await wrapper.find('#password').setValue('test')
    await wrapper.find('#login-form').trigger('submit')

    expect(wrapper.find('#login-error').exists()).toBe(true)
    expect(authRepository.getToken).not.toBeCalled()
    expect(localeService.t).toHaveBeenCalledWith('login_error_credentials', {})
  })

  it('wrong password', async () => {
    vi.spyOn(authRepository, 'getToken').mockResolvedValue({status: 401})

    const wrapper = mount(Login)

    await wrapper.find('#username').setValue('DOEJOHN')
    await wrapper.find('#password').setValue('test')
    await wrapper.find('#login-form').trigger('submit')

    expect(wrapper.find('#login-error').exists()).toBe(true)
  })

  it('connect successfuly', async () => {
    vi.spyOn(routerService, 'redirectAfterLogin').mockReturnValue(true)
    vi.spyOn(authRepository, 'getToken').mockResolvedValue({ status: 200, data : {access_token: "access_test", refresh_token: "refresh_test"}})

    const wrapper = mount(Login)

    await wrapper.find('#username').setValue('DOEJOHN')
    await wrapper.find('#password').setValue('test')
    await wrapper.find('#login-form').trigger('submit')
  })

  it('correct render', async () => {
    const wrapper = mount(Login)

    expect(wrapper.html()).toMatchInlineSnapshot(`
      "<div class="container-login | d-flex">
        <div class="w-full d-flex j-center p-relative"><img src="/images/vuemann/brugmann.webp" class="login-image | image-responsive"></div>
        <div class="login-side">
          <div class="login-card | p-relative p-20">
            <h1 class="login-title | h1 color-primary text-center mb-25">Connexion</h1>
            <form id="login-form" class="login-form | f-column g-20 px-15 mb-15">
              <!--v-if-->
              <div class="form-component">
                <div class="p-relative"><input id="username" name="username" type="text" autocomplete="off" class="form-input input" placeholder=" "><label class="form-label" for="username">Username</label>
                  <!--v-if-->
                </div>
                <!--v-if-->
              </div>
              <div class="form-component">
                <div class="p-relative"><input id="password" name="password" type="password" autocomplete="off" class="form-input input" placeholder=" "><label class="form-label" for="password">Mot de passe</label><button class="input-button | d-flex align-center" type="button" title="show password" data-toggle="password"><i class="fa-solid mx-15 fa-eye"></i></button></div>
                <!--v-if-->
              </div>
              <div class="d-flex j-center">
                <div class="loader_container"><button class="loader-tabs login-button | btn btn-primary" type="submit">Connexion
                    <!--v-if-->
                  </button>
                  <!--v-if-->
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>"
    `)
  }) 
})

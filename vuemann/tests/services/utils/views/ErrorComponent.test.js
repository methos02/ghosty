import {describe, expect, it, beforeEach, vi} from "vitest";
import { mount } from "@vue/test-utils";
import Error from "@brugmann/vuemann/src/services/utils/views/ErrorComponent.vue";
import {createPinia, setActivePinia} from "pinia";
import { useUtilsStore } from "@brugmann/vuemann/src/services/utils/src/utils-store.js";
import { routerService } from "@brugmann/vuemann/src/services/router/init/router-service.js";
import { localeService } from "@brugmann/vuemann/src/services/locale/init/locale-service.js";

describe('Error component', () => {
  it('if not error', async () => {
    vi.spyOn(routerService, 'push').mockImplementation(() => {});
    mount(Error)

    expect(routerService.push).toHaveBeenCalledOnce()
  }) 

  beforeEach(() => {setActivePinia(createPinia())});

  it('correct render with globalError', async () => {
    vi.spyOn(localeService, 't').mockReturnValueOnce('error test')

    const utilsStore = useUtilsStore()
    utilsStore.errorGlobal = "error-test"
    const wrapper = mount(Error)

    expect(wrapper.html()).toMatchInlineSnapshot(`
      "<div id="container-error" class="f-center flex-1">
        <p class="h1 color-primary" data-error="">error test</p>
      </div>"
    `)

    expect(wrapper.html()).contains('error test')
  })

  it('correct render with globalErrors', async () => {
    vi.spyOn(localeService, 't').mockReturnValueOnce('error test').mockReturnValueOnce('error2 test')

    const utilsStore = useUtilsStore()
    utilsStore.errorsGlobal = ["error-test", "error2-test"]
    const wrapper = mount(Error)

    expect(wrapper.html()).toMatchInlineSnapshot(`
      "<div id="container-error" class="f-center flex-1">
        <!--v-if-->
        <p class="h1 color-primary" data-error="">error test</p>
        <p class="h1 color-primary" data-error="">error2 test</p>
      </div>"
    `)

    expect(wrapper.html()).contains('error test')
    expect(wrapper.html()).contains('error2 test')

    const errorElements = wrapper.findAll('[data-error]');
    expect(errorElements.length).toBe(2);
  })
})

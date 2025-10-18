import {describe, expect, it, beforeEach, vi, afterEach} from "vitest";
import { mount } from "@vue/test-utils";
import DebugBar from "@brugmann/vuemann/src/services/utils/views/DebugBarComponent.vue";
import {createPinia, setActivePinia} from "pinia";
import { nextTick } from "vue";
import { utilsService } from '@brugmann/vuemann/src/services/utils/init/utils-service.js';

describe('DebugBar component', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.spyOn(utilsService, 'needUpdate').mockResolvedValue(true)
  });

  afterEach(() => vi.clearAllMocks())

  it('correct render', async () => {
    const wrapper = mount(DebugBar, { props : { version : 'test' }})

    expect(wrapper.html()).toMatchInlineSnapshot(`
      "<div class="instance-div | f-column g-5 py-10 px-20 bg-neutral-100">
        <!--v-if-->
        <!--v-if-->
        <!--v-if-->
        <div>
          <p>Version test</p>
          <!--v-if-->
        </div>
      </div>"
    `)
  }) 

  it('test mode', async () => {
    const wrapper = mount(DebugBar, { props : { version : 'test' }})
    wrapper.vm.updateMode({api: 'test'})
    await nextTick()

    expect(wrapper.html()).toMatchInlineSnapshot(`
      "<div class="instance-div | f-column g-5 py-10 px-20 bg-neutral-100">
        <!--v-if-->
        <div class="d-flex g-10"><i class="fa-brands fa-dev fs-700"></i>
          <p>mode test</p>
        </div>
        <!--v-if-->
        <div>
          <p>Version test</p>
          <!--v-if-->
        </div>
      </div>"
    `)
  }) 

  it('test production', async () => {
    const wrapper = mount(DebugBar, { props : { version : 'test' }})
    wrapper.vm.updateMode({api: 'production'})
    await nextTick()

    expect(wrapper.html()).toMatchInlineSnapshot(`
      "<div class="instance-div | f-column g-5 py-10 px-20 bg-neutral-100">
        <!--v-if-->
        <!--v-if-->
        <!--v-if-->
        <div>
          <p>Version test</p>
          <!--v-if-->
        </div>
      </div>"
    `)
  }) 

  it('différente instance', async () => {
    const consoleErrorMock = vi.spyOn(console, 'error').mockImplementation(() => {});
    const wrapper = mount(DebugBar, { props : { version : 'test' }})
    wrapper.vm.updateMode({api: 'production', api2: 'test'})
    await nextTick()

    expect(wrapper.html()).toMatchInlineSnapshot(`
      "<div class="instance-div | f-column g-5 py-10 px-20 bg-neutral-100">
        <!--v-if-->
        <!--v-if-->
        <p class="color-danger">Des modes différents ont été detecté parmis les API. <br> Consultez la console pour plus de détail.</p>
        <div>
          <p>Version test</p>
          <!--v-if-->
        </div>
      </div>"
    `)

    consoleErrorMock.mockRestore();
  }) 
})

import Loader from '@brugmann/vuemann/src/components/LoaderComponent.vue'
import {describe, expect, it, beforeEach, afterEach, vi} from "vitest";
import {createPinia, setActivePinia} from "pinia";
import { mount } from "@vue/test-utils";
import { nextTick } from 'vue';

describe('Loader component', () => {
  let cbMock
  beforeEach(() => { 
    setActivePinia(createPinia())
    cbMock = vi.fn(() => new Promise(resolve => setTimeout(resolve, 5)));
  })

  afterEach(() => vi.restoreAllMocks())

  it('with parameters', async () => {
    expect(() => mount(Loader)).toThrow("La propriété cb ou click doivent être renseigné");
  })

  it('avec paramètres', async () => {
    const wrapper = mount(Loader, {props: { buttonClasses: 'test', buttonType: 'button', 'cb': cbMock}, slots:{ default: 'test-content'}})

    expect(wrapper.html()).toMatchInlineSnapshot(`
      "<div class="loader_container"><button class="loader-tabs test" type="button">test-content
          <!--v-if-->
        </button>
        <!--v-if-->
      </div>"
    `)


    expect(wrapper.html()).contains('test"')
    expect(wrapper.html()).contains('type="button')
    expect(wrapper.html()).contains('test-content')
  })

  it('avec paramètres type submit', async () => {
    const wrapper = mount(Loader, {props: { buttonClasses: 'test', buttonType: 'submit', 'cb': cbMock }, slots: { default: 'test-content'}})

    expect(wrapper.html()).toMatchInlineSnapshot(`
      "<div class="loader_container"><button class="loader-tabs test" type="submit">test-content
          <!--v-if-->
        </button>
        <!--v-if-->
      </div>"
    `)

    expect(wrapper.html()).contains('type="submit')
  })

  it('vérification de cb', async () => {
    const wrapper = mount(Loader, {props: {'cb': cbMock }, slots:{ default: 'test-content'}})
    expect(wrapper.vm.loading).toBe(false);

    const runCallBack = wrapper.vm.runCallBack()

    expect(cbMock).toHaveBeenCalled();
    expect(wrapper.vm.loading).toBe(true);

    await runCallBack;

    expect(wrapper.vm.loading).toBe(false)
  })

  it('vérification du click', async () => {
    vi.useFakeTimers();
    const wrapper = mount(Loader, {props: {'click': cbMock }, slots:{ default: 'test-content'}})
    
    expect(wrapper.vm.loading).toBe(false);

    await wrapper.find('button').trigger('click');
  
    expect(cbMock).toHaveBeenCalled();
    expect(wrapper.vm.loading).toBe(true);

    vi.runAllTimers();
    await nextTick();

    expect(wrapper.vm.loading).toBe(false)
    vi.useRealTimers();
  })

  it('setLoad', async () => {    
    const wrapper = mount(Loader, {props: {'click': cbMock }, slots:{ default: 'test-content'}})

    wrapper.vm.setLoad(true)
    await wrapper.vm.$nextTick();

    expect(wrapper.vm.loading).toBe(true)
    expect(wrapper.html()).contains('data-loader')

    wrapper.vm.setLoad(false)
    await wrapper.vm.$nextTick();

    expect(wrapper.vm.loading).toBe(false)
    expect(wrapper.html()).not.contains('data-loader')
  })

  it('inifinite options', async () => {
    const wrapper = mount(Loader, {props: {'cb': cbMock, infinite: true }, slots:{ default: 'test-content'}})
    expect(wrapper.vm.loading).toBe(false);

    await wrapper.vm.runCallBack()
    expect(wrapper.vm.loading).toBe(true);

    wrapper.vm.setLoad(false)
    expect(wrapper.vm.loading).toBe(false)
  })

  it('avec paramètres additionnels pour cb', async () => {
    const wrapper = mount(Loader, {
      props: { cb: cbMock, params: [1, 'two', { three: 3 }] },
      slots: { default: 'test-content' }
    });
    await wrapper.vm.runCallBack();
    expect(cbMock).toHaveBeenCalledWith(1, 'two', { three: 3 });
  });

  it('avec type icon', async () => {
    const wrapper = mount(Loader, {
      props: { buttonClasses: 'icon-test', type: 'icon', cb: cbMock },
      slots: { default: 'icon-content' }
    });
    expect(wrapper.html()).toContain('loader-icon');
    expect(wrapper.html()).toContain('icon-content');
    expect(wrapper.html()).toContain('icon-test');

    expect(wrapper.html()).toMatchInlineSnapshot(`
      "<div class="loader_container">
        <!--v-if--><button class="loader-icon | pointer f-center icon-test" type="button">icon-content
          <!--v-if-->
        </button>
      </div>"
    `)
  });
})

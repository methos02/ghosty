import {describe, expect, it, vi, beforeEach, afterEach} from "vitest";
import {createPinia, setActivePinia} from "pinia";
import { flushPromises, mount } from "@vue/test-utils";
import InputSearch from '@brugmann/vuemann/src/services/form/views/inputs/InputSearchComponent.vue';
import { nextTick } from "vue";

describe('input search component', () => {
  beforeEach(() => setActivePinia(createPinia()) )
  
  let onInputMock = vi.fn(() => new Promise(resolve => setTimeout(() => resolve(['test']), 100)))

  afterEach(() => vi.restoreAllMocks())

  it('correct render', async () => {
    const wrapper = mount(InputSearch, { props: { name: 'input-test', cb: onInputMock, label: 'label test'}})

    expect(wrapper.html()).toMatchInlineSnapshot(`
      "<div class="dropdown">
        <div id="dropdown-button">
          <div class="input-search"><input id="input-test" name="input-test" class="form-input input" type="search" autocomplete="off" placeholder=""><label for="input-test" class="form-label">label test</label>
            <!--v-if-->
          </div>
        </div>
        <div data-items="" class="dropdown-items bottom left" style="display: none;"></div>
      </div>"
    `)
  })
  
  it('with parameter', async () => {
    const wrapper = mount(InputSearch, {props: { 
      name: 'input-test', 
      cb: onInputMock, 
      label: 'label test',
    }})

    expect(wrapper.html()).toMatchInlineSnapshot(`
      "<div class="dropdown">
        <div id="dropdown-button">
          <div class="input-search"><input id="input-test" name="input-test" class="form-input input" type="search" autocomplete="off" placeholder=""><label for="input-test" class="form-label">label test</label>
            <!--v-if-->
          </div>
        </div>
        <div data-items="" class="dropdown-items bottom left" style="display: none;"></div>
      </div>"
    `)

    expect(wrapper.html()).contains('id="input-test"')
    expect(wrapper.html()).contains('label test')
  })

  it('run callback', async () => {
    vi.useFakeTimers();
    const wrapper = mount(InputSearch, {props: { name: 'input-test', cb: onInputMock, label: 'label test'}})
  
    expect(wrapper.vm.loading).toBe(false);

    const searchInput = wrapper.find('#input-test')
    await searchInput.setValue('test')
    await searchInput.trigger('input')
    
    vi.runAllTimers();

    expect(onInputMock).toHaveBeenCalled();
    expect(onInputMock).toHaveBeenCalledWith('test');
    expect(wrapper.vm.loading).toBe(true);

    await flushPromises()

    expect(wrapper.vm.loading).toBe(false)
  })
  
  it('change input value without pattern', async () => {
    const wrapper = mount(InputSearch, { props: { name: 'input-test', cb: onInputMock, label: 'label test'}})
    const { preventKey } = wrapper.vm;
    
    // Simuler une touche valide (chiffre 1)
    const validEvent = new KeyboardEvent('keypress', { key: '1', keyCode: 49 });
    const validResult = preventKey(validEvent);
    expect(validResult).toBe(true);

    // Simuler une touche invalide (lettre A)
    const invalidEvent = new KeyboardEvent('keypress', { key: 'A', keyCode: 65 });
    const invalidResult = preventKey(invalidEvent);
    expect(invalidResult).toBe(true);
  })

  it('preventKey', async () => {    
    const wrapper = mount(InputSearch, {props: { name: 'input-test', cb: onInputMock, label: 'label test', pattern: /^\d+$/}})
    const { preventKey } = wrapper.vm;

    // Simuler une touche valide (chiffre 1)
    const validEvent = new KeyboardEvent('keypress', { key: '1', keyCode: 49 });
    const validResult = preventKey(validEvent);
    expect(validResult).toBe(true);

    // Simuler une touche invalide (lettre A)
    const invalidEvent = new KeyboardEvent('keypress', { key: 'A', keyCode: 65 });
    const invalidResult = preventKey(invalidEvent);
    expect(invalidResult).toBe(false);
  })

  it('setSearch', async () => {
    const wrapper = mount(InputSearch, {props: { name: 'input-test', cb: onInputMock, label: 'label test'}})
    const { setSearch } = wrapper.vm;
    setSearch('test')
    expect(wrapper.vm.search).toBe('test')
  })

  it('resetSearch', async () => {
    const wrapper = mount(InputSearch, {props: { name: 'input-test', cb: onInputMock, label: 'label test'}})
    const { resetSearch } = wrapper.vm;
    resetSearch()
    expect(wrapper.vm.search).toBe('')
  })

  it('toggleDropdown', async () => {
    const wrapper = mount(InputSearch, {props: { name: 'input-test', cb: onInputMock, label: 'label test'}})
    const { toggleDropdown } = wrapper.vm;
    toggleDropdown(true)
    await flushPromises()

    const items = wrapper.find('[data-items]')
    const style = window.getComputedStyle(items.element)

    expect(style.display).not.toBe('none')
  })

  it('setItems', async () => {
    const wrapper = mount(InputSearch, {props: { name: 'input-test', cb: onInputMock, label: 'label test'}})
    const { setItems } = wrapper.vm;
    setItems(['test'])
    expect(wrapper.vm.items).toStrictEqual(['test'])
  })

  it('focus', async () => {
    const wrapper = mount(InputSearch, {
      attachTo: document.body, 
      props: { name: 'input-test', cb: onInputMock, label: 'label test'}
    })

    wrapper.vm.focus()
    await nextTick()

    expect(document.activeElement).toBe(wrapper.find('#input-test').element)
  })

  it('emit update:modelValue', async () => {
    const wrapper = mount(InputSearch, {props: { name: 'input-test', cb: onInputMock, label: 'label test'}})
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
    
    wrapper.vm.search = 'nouvelle valeur'
    await nextTick()

    const emitted = wrapper.emitted('update:modelValue')
    expect(emitted).toHaveLength(1)                   
    expect(emitted[0]).toEqual(['nouvelle valeur'])
  })
})

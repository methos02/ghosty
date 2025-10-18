import { describe, expect, it, beforeEach } from "vitest";
import { mount } from "@vue/test-utils";
import { createPinia, setActivePinia } from "pinia";
import Switch from '@brugmann/vuemann/src/services/form/views/inputs/SwitchComponent.vue';
import { localeFunctions } from "@brugmann/vuemann/src/services/locale/src/locale-functions.js";
import { formStore } from "@brugmann/vuemann/src/services/form/src/form-store.js";

describe('SwitchComponent', () => {
  beforeEach(() => setActivePinia(createPinia()))

  it('renders with required props', () => {
    const wrapper = mount(Switch, {
      props: { 
        name: 'switch-test', 
        prefix: 'Test Switch'
      }
    })

    expect(wrapper.find('input[type="checkbox"]').exists()).toBe(true)
    expect(wrapper.find('.switch-text').classes()).not.toContain('required')
    expect(wrapper.find('.switch-text').text()).toBe('Test Switch')
    expect(wrapper.find('input').attributes('id')).toBe('switch-test')
    expect(wrapper.find('input').attributes('name')).toBe('switch-test')
    expect(wrapper.find('label').attributes('for')).toBe('switch-test')

    expect(wrapper.find('.form-component.switch-component').exists()).toBe(true)
    expect(wrapper.find('.switch-wrapper').exists()).toBe(true)
    expect(wrapper.find('.switch-input').exists()).toBe(true)
    expect(wrapper.find('.switch-label').exists()).toBe(true)
    expect(wrapper.find('.switch-slider').exists()).toBe(true)
    expect(wrapper.find('.switch-text').exists()).toBe(true)
  })

  it('renders all props correctly', () => {
    const wrapper = mount(Switch, {
      props: { 
        name: 'switch-test', 
        prefix: 'Required Switch',
        required: true,
        disabled: true,
        form: 'test-form'
      }
    })

    expect(wrapper.find('.switch-text').classes()).toContain('required')
    expect(wrapper.find('input').attributes('disabled')).toBeDefined()
    expect(wrapper.find('input').attributes('id')).toBe('test-form.switch-test')
    expect(wrapper.find('input').attributes('name')).toBe('test-form.switch-test')
  })

  it('toggles value when clicked', async () => {
    const wrapper = mount(Switch, {
      props: { 
        name: 'switch-test', 
        prefix: 'Toggle Switch'
      }
    })

    const input = wrapper.find('input[type="checkbox"]')
    
    expect(input.element.checked).toBe(false)
    
    await input.setValue(true)
    expect(input.element.checked).toBe(true)
    
    await input.setValue(false)
    expect(input.element.checked).toBe(false)
  })

  it('emits update:modelValue when toggled', async () => {
    const wrapper = mount(Switch, {
      props: { 
        name: 'switch-test', 
        prefix: 'Event Switch'
      }
    })

    const input = wrapper.find('input[type="checkbox"]')
    
    await input.setValue(true)
    
    expect(wrapper.emitted()['update:modelValue']).toBeTruthy()
    expect(wrapper.emitted()['update:modelValue'][0]).toEqual([true])
    
    await input.setValue(false)
    expect(wrapper.emitted()['update:modelValue'][1]).toEqual([false])
  })

  it('accepts initial value through v-model', () => {
    const wrapper = mount(Switch, {
      props: { 
        name: 'switch-test', 
        prefix: 'Initial Value Switch',
        modelValue: true
      }
    })

    const input = wrapper.find('input[type="checkbox"]')
    expect(input.element.checked).toBe(true)
  })

  it('disables interaction when disabled prop is true', async () => {
    const wrapper = mount(Switch, {
      props: { 
        name: 'switch-test', 
        prefix: 'Disabled Switch',
        disabled: true
      }
    })

    const input = wrapper.find('input[type="checkbox"]')
    
    await input.trigger('change')
    expect(input.element.checked).toBe(false)
    expect(wrapper.emitted()['update:modelValue']).toBeFalsy()
  })

  it('shows error component when error prop is true and error exists', () => {
    localeFunctions.getTranslater().global.mergeLocaleMessage('fr', {'switch-error': 'Switch error message'})
    
    formStore.addError('switch-test', 'switch-error')

    const wrapper = mount(Switch, {
      props: { 
        name: 'switch-test', 
        prefix: 'Switch with Error'
      }
    })

    expect(wrapper.html()).toContain('id="error-switch-test"')
  })

  it('hides error component when error prop is false', () => {
    localeFunctions.getTranslater().global.mergeLocaleMessage('fr', {'switch-error': 'Switch error message'})
        
    formStore.addError('switch-test', 'switch-error')

    const wrapper = mount(Switch, {
      props: { 
        name: 'switch-test', 
        prefix: 'Switch without Error',
        error: false
      }
    })

    expect(wrapper.html()).not.toContain('id="error-switch-test"')
  })
})

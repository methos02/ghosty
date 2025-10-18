import { describe, it, expect, beforeEach } from 'vitest';
import {createPinia, setActivePinia} from "pinia";
import { mount } from '@vue/test-utils';
import TextareaComponent from '@brugmann/vuemann/src/services/form/views/inputs/TextareaComponent.vue';

describe('TextAreaComponent.vue', () => {
  beforeEach(() => setActivePinia(createPinia()) )
  
  it('renders with default props', () => {
    const wrapper = mount(TextareaComponent, {
      props: {
        name: 'test-name',
      },
    });

    expect(wrapper.find('textarea').exists()).toBe(true);
    expect(wrapper.find('label').exists()).toBe(false);
  });

  it('renders props', () => {
    const wrapper = mount(TextareaComponent, {
      props: {
        name: 'test-name',
        label: 'Test Label',
        required: true,
        autogrow: true,
      },
    });

    expect(wrapper.find('label').text()).toBe('Test Label');
    expect(wrapper.find('label').classes()).toContain('required');
    expect(wrapper.find('textarea').classes()).toContain('autogrow');
  });

  it('emits update:modelValue event when value changes', async () => {
    const wrapper = mount(TextareaComponent, {
      props: {
        name: 'test-name',
      },
    });

    const textarea = wrapper.find('textarea');
    textarea.element.value = 'New Value';
    textarea.trigger('input');

    await wrapper.vm.$nextTick();

    expect(wrapper.emitted()['update:modelValue']).toBeTruthy();
    expect(wrapper.emitted()['update:modelValue'][0]).toEqual(['New Value']);
  });

  it('auto-grows textarea when autogrow is true', async () => {
    const wrapper = mount(TextareaComponent, {
      props: {
        name: 'test-name',
        autogrow: true,
      },
    });

    const textarea = wrapper.find('textarea');
    textarea.element.value = 'New Value\nNew Line';
    textarea.trigger('input');

    await wrapper.vm.$nextTick();

    expect(textarea.element.style.height).toBe(textarea.element.scrollHeight + 'px');
  });
});

import {describe, expect, it, beforeEach} from "vitest";
import { mount } from "@vue/test-utils";
import {createPinia, setActivePinia} from "pinia";
import Input from '@brugmann/vuemann/src/services/form/views/inputs/InputComponent.vue';
import { localeFunctions } from "@brugmann/vuemann/src/services/locale/src/locale-functions.js";
import { formStore } from "@brugmann/vuemann/src/services/form/src/form-store.js";

describe('input component', () => {
  beforeEach(() => setActivePinia(createPinia()) )

  it('check toggle password', async () => {
    const wrapper = mount(Input, {props: { 
      name: 'input-test', 
      label: 'label-test',
      type: 'password'
    }})

    expect(wrapper.html()).contains('label-test')
    expect(wrapper.html()).contains('type="password"')

    await wrapper.find('[data-toggle="password"]').trigger('click')
    expect(wrapper.html()).contains('type="text"')

    await wrapper.find('[data-toggle="password"]').trigger('click')
    expect(wrapper.html()).contains('type="password"')
  })

  it('check options', async () => {    
    const wrapper = mount(Input, {props: { 
      name: 'input-test', 
      autocomplete: 'on',
      label: 'label-test',
      required : true
    }})

    expect(wrapper.html()).contains('autocomplete="on"')
    expect(wrapper.html()).contains('label-test')
    expect(wrapper.html()).contains('required')
  })

  it('password with parameters', async () => {
    const wrapper = mount(Input, {props: { 
      name: 'input-test', 
      label: 'label-test',
      type: 'password'
    }})

    expect(wrapper.html()).toMatchInlineSnapshot(`
      "<div class="form-component">
        <div class="p-relative"><input id="input-test" name="input-test" type="password" autocomplete="off" class="form-input input" placeholder=" "><label class="form-label" for="input-test">label-test</label><button class="input-button | d-flex align-center" type="button" title="show password" data-toggle="password"><i class="fa-solid mx-15 fa-eye"></i></button></div>
        <!--v-if-->
      </div>"
    `)

    expect(wrapper.html()).contains('id="input-test"')
    expect(wrapper.html()).contains('type="password"')
    expect(wrapper.html()).contains('<i class="fa-solid mx-15 fa-eye"></i>')
    expect(wrapper.html()).not.contains('required')
  })

  it('show error', async () => {   
    localeFunctions.getTranslater().global.mergeLocaleMessage('fr', {'error-test': 'error-test'})

    formStore.addError('input-test', 'error-test')

    const wrapper = mount(Input, {props: { name: 'input-test', label: 'label-test'}})

    expect(wrapper.html()).contains('id="error-input-test"')
  })

  it('disable error', async () => {   
    localeFunctions.getTranslater().global.mergeLocaleMessage('fr', {'error-test': 'error-test'})
        
    formStore.addError('input-test', 'error-test')

    const wrapper = mount(Input, {props: { name: 'input-test', label: 'label-test', error: false}})

    expect(wrapper.html()).not.contains('id="error-input-test"')
  })
})

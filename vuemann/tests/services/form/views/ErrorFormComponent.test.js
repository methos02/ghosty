import {describe, expect, it, beforeEach} from "vitest";
import {createPinia, setActivePinia} from "pinia";
import { mount } from "@vue/test-utils";
import ErrorForm from "@brugmann/vuemann/src/services/form/views/ErrorFormComponent.vue";
import { formStore } from "@brugmann/vuemann/src/services/form/src/form-store.js";
import { localeFunctions } from "@brugmann/vuemann/src/services/locale/src/locale-functions.js";

describe('input error component', () => {
    beforeEach(() => setActivePinia(createPinia()) )

    it('correct render empty', async () => {
      const wrapper = mount(ErrorForm, {props: {name: 'test'}})

      expect(wrapper.html()).toMatchInlineSnapshot(`"<!--v-if-->"`)
    }) 

    it('with parameter', async () => {
      localeFunctions.getTranslater().global.mergeLocaleMessage('fr', {'error-test': 'error-test'})

      formStore.addError('test', 'error-test')

      const wrapper = mount(ErrorForm, {props: {name: 'test'}})

      expect(wrapper.html()).toMatchInlineSnapshot(`"<p id="error-test" class="form-error">error-test</p>"`)
      expect(wrapper.html()).contains('id="error-test"')
      expect(wrapper.html()).contains('error-test')
    })

    it('with error not in store', async () => {
      const wrapper = mount(ErrorForm, {props: {name: 'test', error: 'error-test'}})

      expect(wrapper.html()).toMatchInlineSnapshot(`"<p id="error-test" class="form-error">error-test</p>"`)
      expect(wrapper.html()).contains('id="error-test"')
      expect(wrapper.html()).contains('error-test')
    })
})

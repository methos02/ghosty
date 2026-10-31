import { describe, it, expect, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import InputComponent from '@/services/form/views/inputs/InputComponent.vue'
import { form } from '@/services/shortcuts/services-shortcut.js'

describe('InputComponent.vue', () => {
  let wrapper

  afterEach(() => {
    wrapper?.unmount()
    wrapper = undefined
    form.clearErrors()
  })

  it('outlines the field in red while it holds an error, to spot it at a glance', async () => {
    wrapper = mount(InputComponent, { props: { name: 'field', form: 'chapter', label: 'Titre' } })

    form.addError('chapter.field', 'chapter_manage.error_summary_required')
    await wrapper.vm.$nextTick()

    expect(wrapper.find('input').classes()).toContain('invalide')
  })

  it('keeps its usual outline when the error belongs to another field', async () => {
    wrapper = mount(InputComponent, { props: { name: 'field', form: 'chapter', label: 'Titre' } })

    form.addError('chapter.other', 'chapter_manage.error_summary_required')
    await wrapper.vm.$nextTick()

    expect(wrapper.find('input').classes()).not.toContain('invalide')
  })
})

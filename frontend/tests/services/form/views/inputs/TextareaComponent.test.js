import { describe, it, expect, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import TextareaComponent from '@/services/form/views/inputs/TextareaComponent.vue'
import { form } from '@/services/shortcuts/services-shortcut.js'

describe('TextareaComponent.vue', () => {
  let wrapper

  afterEach(() => {
    wrapper?.unmount()
    wrapper = undefined
    form.clearErrors()
  })

  it('outlines the field in red while it holds an error, to spot it at a glance', async () => {
    wrapper = mount(TextareaComponent, {
      props: { name: 'field', form: 'chapter', label: 'Résumé' },
    })

    form.addError('chapter.field', 'chapter_manage.error_summary_required')
    await wrapper.vm.$nextTick()

    expect(wrapper.find('textarea').classes()).toContain('invalide')
  })

  it('keeps its usual outline when the error belongs to another field', async () => {
    wrapper = mount(TextareaComponent, {
      props: { name: 'field', form: 'chapter', label: 'Résumé' },
    })

    form.addError('chapter.other', 'chapter_manage.error_summary_required')
    await wrapper.vm.$nextTick()

    expect(wrapper.find('textarea').classes()).not.toContain('invalide')
  })
})

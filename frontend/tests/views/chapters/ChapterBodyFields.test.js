import { describe, it, expect, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import ChapterBodyFields from '@/views/chapters/ChapterBodyFields.vue'
import { form } from '@/services/shortcuts/services-shortcut.js'

describe('ChapterBodyFields.vue', () => {
  let wrapper

  afterEach(() => {
    wrapper?.unmount()
    wrapper = undefined
    form.clearErrors()
  })

  const mountFields = (props = {}) => {
    wrapper = mount(ChapterBodyFields, { props })
    return wrapper
  }

  const sections = () => wrapper.findAll('.chapter-body__section')

  it('opens on the story, the summary waiting behind its own tab', () => {
    mountFields()

    expect(sections().map(section => section.text())).toEqual(['Récit', 'Résumé'])
    expect(wrapper.find('textarea[name="chapter.content"]').exists()).toBe(true)
    expect(wrapper.find('textarea[name="chapter.summary"]').exists()).toBe(false)
  })

  it('shows one panel at a time, so a long text keeps the screen', async () => {
    mountFields()

    await sections()[1].trigger('click')

    expect(wrapper.find('textarea[name="chapter.summary"]').exists()).toBe(true)
    expect(wrapper.find('textarea[name="chapter.content"]').exists()).toBe(false)
  })

  it('reports each field to its own model', async () => {
    mountFields({ content: 'un debut', summary: 'un resume' })

    await wrapper.find('textarea[name="chapter.content"]').setValue('une suite')
    expect(wrapper.emitted('update:content').at(-1)).toEqual(['une suite'])

    await sections()[1].trigger('click')
    await wrapper.find('textarea[name="chapter.summary"]').setValue('un autre resume')
    expect(wrapper.emitted('update:summary').at(-1)).toEqual(['un autre resume'])
  })

  it('flags the hidden panel in danger, an error must not stay out of sight', async () => {
    mountFields()

    expect(sections()[1].classes()).toContain('btn-primary-alt')

    form.addError('chapter.summary', 'chapter_manage.error_summary_required')
    await wrapper.vm.$nextTick()

    expect(sections()[1].classes()).toContain('btn-danger-alt')
    expect(sections()[0].classes()).toContain('btn-primary')
  })
})

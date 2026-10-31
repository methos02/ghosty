import { describe, it, expect, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import ChapterBodyFields from '@/views/chapters/ChapterBodyFields.vue'
import { form, t } from '@/services/shortcuts/services-shortcut.js'

describe('ChapterBodyFields.vue', () => {
  let wrapper

  afterEach(() => {
    wrapper?.unmount()
    wrapper = undefined
    form.clearErrors()
  })

  it('opens on the story, the summary waiting behind its own tab', () => {
    wrapper = mount(ChapterBodyFields)

    expect(wrapper.findAll('.chapter-body__section').map(section => section.text())).toEqual([
      'Récit',
      'Résumé',
    ])
    expect(wrapper.find('textarea[name="chapter.content"]').exists()).toBe(true)
    expect(wrapper.find('textarea[name="chapter.summary"]').exists()).toBe(false)
  })

  it('shows one panel at a time, so a long text keeps the screen', async () => {
    wrapper = mount(ChapterBodyFields)

    await wrapper.findAll('.chapter-body__section')[1].trigger('click')

    expect(wrapper.find('textarea[name="chapter.summary"]').exists()).toBe(true)
    expect(wrapper.find('textarea[name="chapter.content"]').exists()).toBe(false)
  })

  it('reports each field to its own model', async () => {
    wrapper = mount(ChapterBodyFields, { props: { content: 'un debut', summary: 'un resume' } })

    await wrapper.find('textarea[name="chapter.content"]').setValue('une suite')
    expect(wrapper.emitted('update:content').at(-1)).toEqual(['une suite'])

    await wrapper.findAll('.chapter-body__section')[1].trigger('click')
    await wrapper.find('textarea[name="chapter.summary"]').setValue('un autre resume')
    expect(wrapper.emitted('update:summary').at(-1)).toEqual(['un autre resume'])
  })

  it('flags the hidden panel in danger, an error must not stay out of sight', async () => {
    wrapper = mount(ChapterBodyFields)

    expect(wrapper.findAll('.chapter-body__section')[1].classes()).toContain('btn-primary-alt')

    form.addError('chapter.content', 'chapter_manage.error_content_required')
    form.addError('chapter.summary', 'chapter_manage.error_summary_required')
    await wrapper.vm.$nextTick()

    expect(wrapper.findAll('.chapter-body__section')[1].classes()).toContain('btn-danger-alt')
    expect(wrapper.findAll('.chapter-body__section')[0].classes()).toContain('btn-danger')
  })

  it('opens the summary on its own when it is the only part left unfinished', async () => {
    wrapper = mount(ChapterBodyFields)

    form.addError('chapter.summary', 'chapter_manage.error_summary_required')
    await wrapper.vm.$nextTick()

    expect(wrapper.find('textarea[name="chapter.summary"]').exists()).toBe(true)
    expect(wrapper.find('[id="error-chapter.summary"]').text()).toBe(
      t('chapter_manage.error_summary_required'),
    )
  })

  it('brings the story back first when both parts fail, the text matters more', async () => {
    wrapper = mount(ChapterBodyFields)
    await wrapper.findAll('.chapter-body__section')[1].trigger('click')

    form.addError('chapter.summary', 'chapter_manage.error_summary_required')
    form.addError('chapter.content', 'chapter_manage.error_content_required')
    await wrapper.vm.$nextTick()

    expect(wrapper.find('textarea[name="chapter.content"]').exists()).toBe(true)
  })
})

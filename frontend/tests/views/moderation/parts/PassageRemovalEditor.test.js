import { describe, it, expect, vi, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import PassageRemovalEditor from '@/views/moderation/parts/PassageRemovalEditor.vue'
import { t } from '@/services/shortcuts/services-shortcut.js'
import { moderationSeeder } from '&/utils/seeders/moderation-seeder.js'

describe('PassageRemovalEditor.vue', () => {
  let wrapper

  afterEach(() => {
    globalThis.getSelection().removeAllRanges()
    wrapper?.unmount()
    wrapper = undefined
    vi.clearAllMocks()
  })

  it('replaces the passage selected in the displayed text by the removed passage marker', async () => {
    const { content } = moderationSeeder.getModeratedChapterApi()
    wrapper = mount(PassageRemovalEditor, {
      attachTo: document.body,
      props: {
        original: content,
        modelValue: content,
        'onUpdate:modelValue': value => wrapper.setProps({ modelValue: value }),
      },
    })
    const passage = moderationSeeder.getRemovedPassage()
    const start = content.indexOf(passage)
    const textNode = wrapper.find('.passage-removal-editor__text').element.firstChild
    const range = document.createRange()
    range.setStart(textNode, start)
    range.setEnd(textNode, start + passage.length)
    globalThis.getSelection().addRange(range)

    await wrapper.find('.passage-removal-editor__remove').trigger('click')

    expect(wrapper.props('modelValue')).toBe(moderationSeeder.getContentAfterRemoval())
  })

  it('leaves the text untouched when nothing is selected', async () => {
    const { content } = moderationSeeder.getModeratedChapterApi()
    wrapper = mount(PassageRemovalEditor, {
      attachTo: document.body,
      props: {
        original: content,
        modelValue: content,
        'onUpdate:modelValue': value => wrapper.setProps({ modelValue: value }),
      },
    })

    await wrapper.find('.passage-removal-editor__remove').trigger('click')

    expect(wrapper.props('modelValue')).toBe(content)
  })

  it('shows the mention in place of the removed passage', () => {
    const { content } = moderationSeeder.getModeratedChapterApi()
    wrapper = mount(PassageRemovalEditor, {
      props: {
        original: content,
        modelValue: moderationSeeder.getContentAfterRemoval(),
      },
    })

    expect(wrapper.find('.passage-removal-editor__removed').text()).toBe(
      t('passage_removal_editor.removed_passage'),
    )
    expect(wrapper.find('.passage-removal-editor__source').text()).not.toContain(
      moderationSeeder.getRemovedPassage(),
    )
  })

  it('brings back the original text on reset', async () => {
    const { content } = moderationSeeder.getModeratedChapterApi()
    wrapper = mount(PassageRemovalEditor, {
      props: {
        original: content,
        modelValue: moderationSeeder.getContentAfterRemoval(),
        'onUpdate:modelValue': value => wrapper.setProps({ modelValue: value }),
      },
    })

    await wrapper.find('.passage-removal-editor__reset').trigger('click')

    expect(wrapper.props('modelValue')).toBe(content)
  })
})

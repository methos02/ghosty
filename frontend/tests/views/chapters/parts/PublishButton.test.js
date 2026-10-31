import { describe, it, expect, vi, afterEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import PublishButton from '@/views/chapters/parts/PublishButton.vue'
import { correctionHelper } from '@/core/helpers/correction-helper.js'
import { t } from '@/services/shortcuts/services-shortcut.js'
import { chapterSeeder } from '&/utils/seeders/chapter-seeder.js'

describe('PublishButton.vue', () => {
  let wrapper

  afterEach(() => {
    wrapper?.unmount()
    wrapper = undefined
    vi.clearAllMocks()
  })

  it('states the single correction, its delay and the words it may change', async () => {
    const { content } = chapterSeeder.getWriteForm()
    wrapper = mount(PublishButton, { props: { cb: vi.fn(), content } })

    await wrapper.find('button').trigger('click')

    const terms = wrapper.find('.publish-button__terms').text()
    expect(wrapper.find('.dialog-header').text()).toBe(t('publish_button.title'))
    expect(terms).toContain(t('publish_button.corrections'))
    expect(terms).toContain(t('publish_button.delay'))
    expect(terms).toContain(
      t('publish_button.max_words', { allowance: correctionHelper.allowanceFor(content) }),
    )
  })

  it('publishes only once the author confirms', async () => {
    const cb = vi.fn()
    wrapper = mount(PublishButton, { props: { cb, content: chapterSeeder.getWriteForm().content } })

    await wrapper.find('button').trigger('click')
    expect(cb).not.toHaveBeenCalled()

    await wrapper.find('.confirm-button__valid').trigger('click')
    await flushPromises()

    expect(cb).toHaveBeenCalled()
  })
})

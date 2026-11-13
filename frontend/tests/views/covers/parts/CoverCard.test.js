import { describe, it, expect, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import CoverCard from '@/views/covers/parts/CoverCard.vue'
import { useCoverComments } from '@/core-vue/composables/comments/use-cover-comments.js'
import { useReport } from '@/core-vue/composables/reports/use-report.js'
import { REPORTED_CONTENT_TYPES } from '@/constants/moderation-constants.js'
import { t } from '@/services/shortcuts/services-shortcut.js'
import { useAuthStore } from '@/services/auth/src/auth-store.js'
import { coverSeeder } from '&/utils/seeders/cover-seeder.js'
import { userSeeder } from '&/utils/seeders/user-seeder.js'

describe('CoverCard.vue', () => {
  afterEach(() => {
    useCoverComments().coverComments.close()
    useReport().report.closeReport()
    useAuthStore().clear()
  })

  it('marks the official cover of the novel', () => {
    const wrapper = mount(CoverCard, {
      props: { cover: coverSeeder.getCover(), isOfficial: true },
    })

    expect(wrapper.find('.cover-card__official').text()).toBe(t('cover_card.official'))
  })

  it('shows no official mark on an alternative cover', () => {
    const wrapper = mount(CoverCard, {
      props: { cover: coverSeeder.getCover(), isOfficial: false },
    })

    expect(wrapper.find('.cover-card__official').exists()).toBe(false)
  })

  it('opens the comments of the cover', async () => {
    const cover = coverSeeder.getCover()
    const wrapper = mount(CoverCard, {
      props: { cover, isOfficial: false },
    })

    await wrapper.find('.cover-card__comments').trigger('click')

    expect(useCoverComments().commentedCover.value).toEqual(cover)
  })

  it('opens the report of the cover for a reader who is not its author', async () => {
    const cover = coverSeeder.getCover()
    useAuthStore().setUser(userSeeder.getUser())
    const wrapper = mount(CoverCard, {
      props: { cover, isOfficial: false },
    })

    await wrapper.find('.cover-card__report').trigger('click')

    expect(useReport().reportedContent.value).toEqual({
      type: REPORTED_CONTENT_TYPES.COVER,
      content: cover,
    })
  })

  it('offers no report to the illustrator of the cover', () => {
    const cover = coverSeeder.getCover()
    useAuthStore().setUser(userSeeder.getUser({ id: cover.author.id }))

    const wrapper = mount(CoverCard, {
      props: { cover, isOfficial: false },
    })

    expect(wrapper.find('.cover-card__report').exists()).toBe(false)
  })
})

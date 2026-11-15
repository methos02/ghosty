import { describe, it, expect, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import ProfileStatistics from '@/views/users/parts/ProfileStatistics.vue'
import { t } from '@/services/shortcuts/services-shortcut.js'
import { userSeeder } from '&/utils/seeders/user-seeder.js'

describe('ProfileStatistics.vue', () => {
  let wrapper

  afterEach(() => {
    wrapper?.unmount()
    wrapper = undefined
  })

  it('shows the reads, likes and continuations received by the user', () => {
    const { statistics } = userSeeder.getProfile()

    wrapper = mount(ProfileStatistics, { props: { statistics } })

    expect(wrapper.find('.profile-statistics__reads').text()).toBe(String(statistics.readCount))
    expect(wrapper.find('.profile-statistics__likes').text()).toBe(String(statistics.likeCount))
    expect(wrapper.find('.profile-statistics__continuations').text()).toBe(
      String(statistics.receivedContinuationCount),
    )
  })

  it('counts the contributions of the user, official covers included', () => {
    const { statistics } = userSeeder.getProfile()

    wrapper = mount(ProfileStatistics, { props: { statistics } })

    const contributions = wrapper.find('.profile-statistics__contributions').text()
    expect(contributions).toContain(t('profile_statistics.novels', statistics.novelCount))
    expect(contributions).toContain(t('profile_statistics.chapters', statistics.chapterCount))
    expect(contributions).toContain(t('profile_statistics.covers', statistics.coverCount))
    expect(contributions).toContain(
      t('profile_statistics.official_covers', statistics.officialCoverCount),
    )
  })

  it('does not mention official covers when the user has none', () => {
    const statistics = {
      ...userSeeder.getProfile().statistics,
      officialCoverCount: 0,
    }

    wrapper = mount(ProfileStatistics, { props: { statistics } })

    expect(wrapper.find('.profile-statistics__contributions').text()).not.toContain(
      t('profile_statistics.official_covers', 1),
    )
  })
})

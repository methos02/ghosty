import { describe, it, expect, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import ModerationSanctionHistory from '@/views/moderation/parts/ModerationSanctionHistory.vue'
import { SanctionDto } from '@/apis/sanctions/dtos/sanction-dto.js'
import { t } from '@/services/shortcuts/services-shortcut.js'
import { SANCTION_TYPES } from '@/constants/moderation-constants.js'
import { moderationSeeder } from '&/utils/seeders/moderation-seeder.js'

describe('ModerationSanctionHistory.vue', () => {
  let wrapper

  afterEach(() => {
    wrapper?.unmount()
    wrapper = undefined
  })

  it('shows the type, the end and the reason of a temporary ban', () => {
    const sanction = SanctionDto.fromShow(moderationSeeder.getSanctionApi())
    wrapper = mount(ModerationSanctionHistory, { props: { sanctions: [sanction] } })

    expect(wrapper.find('.moderation-sanction-history__type').text()).toBe(
      t(`moderation.sanction_types.${sanction.type}`),
    )
    expect(wrapper.find('.moderation-sanction-history__duration').text()).toBe(
      t('moderation_sanction_history.until', { date: sanction.untilFormat }),
    )
    expect(wrapper.find('.moderation-sanction-history__reason').text()).toBe(sanction.reason)
  })

  it('says a ban without end is permanent', () => {
    const sanction = SanctionDto.fromShow(moderationSeeder.getSanctionApi({ until: null }))
    wrapper = mount(ModerationSanctionHistory, { props: { sanctions: [sanction] } })

    expect(wrapper.find('.moderation-sanction-history__duration').text()).toBe(
      t('moderation_sanction_history.permanent'),
    )
  })

  it('gives no duration to a warning', () => {
    const sanction = SanctionDto.fromShow(
      moderationSeeder.getSanctionApi({
        type: SANCTION_TYPES.WARNING,
        until: null,
      }),
    )
    wrapper = mount(ModerationSanctionHistory, { props: { sanctions: [sanction] } })

    expect(wrapper.find('.moderation-sanction-history__duration').exists()).toBe(false)
  })

  it('says when the author was never sanctioned', () => {
    wrapper = mount(ModerationSanctionHistory, { props: { sanctions: [] } })

    expect(wrapper.find('.moderation-sanction-history__empty').text()).toBe(
      t('moderation_sanction_history.empty'),
    )
  })
})

import { describe, it, expect, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import ModerationReportList from '@/views/moderation/parts/ModerationReportList.vue'
import { t } from '@/services/shortcuts/services-shortcut.js'
import { moderationSeeder } from '&/utils/seeders/moderation-seeder.js'

describe('ModerationReportList.vue', () => {
  let wrapper

  afterEach(() => {
    wrapper?.unmount()
    wrapper = undefined
  })

  it('shows the reason, the details and the reporter of each report', () => {
    const { reports } = moderationSeeder.getChapterCase()
    wrapper = mount(ModerationReportList, { props: { reports } })

    const [pending] = wrapper.findAll('.moderation-report-list__report')
    expect(pending.find('.moderation-report-list__reason').text()).toBe(
      t(`common.report_reasons.${reports[0].reason}`),
    )
    expect(pending.find('.moderation-report-list__description').text()).toBe(reports[0].description)
    expect(pending.find('.moderation-report-list__reporter').text()).toBe(
      t('moderation_report_list.reported_by', {
        reporter: reports[0].reporter.username,
        date: reports[0].createdAtFormat,
      }),
    )
  })

  it('tells a pending report from the decision taken on a processed one', () => {
    const { reports } = moderationSeeder.getChapterCase()
    wrapper = mount(ModerationReportList, { props: { reports } })

    expect(wrapper.findAll('.moderation-report-list__status').map(status => status.text())).toEqual(
      [t('moderation_report_list.pending'), t(`moderation.resolutions.${reports[1].resolution}`)],
    )
  })
})

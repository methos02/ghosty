import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import ModerationPage from '@/views/moderation/ModerationPage.vue'
import { ModerationRepository } from '@/apis/moderation/repositories/moderation-repository.js'
import { ModerationDto } from '@/apis/moderation/dtos/moderation-dto.js'
import { NotificationRepository } from '@/apis/notifications/repositories/notification-repository.js'
import { routerPlugin } from '@/services/router/src/router-plugin.js'
import { useAuthStore } from '@/services/auth/src/auth-store.js'
import { t } from '@/services/shortcuts/services-shortcut.js'
import { REPORT_STATUSES } from '@/constants/moderation-constants.js'
import { controllerSuccess } from '&/utils/helpers/controller-response.js'
import { moderationSeeder } from '&/utils/seeders/moderation-seeder.js'
import { notificationSeeder } from '&/utils/seeders/notification-seeder.js'
import { userSeeder } from '&/utils/seeders/user-seeder.js'

const router = routerPlugin.getRouter()

describe('ModerationPage.vue', () => {
  let wrapper

  afterEach(async () => {
    wrapper?.unmount()
    wrapper = undefined
    useAuthStore().clear()
    await router.push('/')
    vi.clearAllMocks()
  })

  beforeEach(() => {
    useAuthStore().setUser(userSeeder.getUser({ roles: ['moderator'] }))
    vi.spyOn(NotificationRepository, 'list').mockResolvedValue(
      controllerSuccess({ data: notificationSeeder.getListApi() }),
    )
  })

  it('opens on the reports still waiting for a decision', async () => {
    vi.spyOn(ModerationRepository, 'listReportedContents').mockResolvedValue(
      controllerSuccess({ data: moderationSeeder.getListApi() }),
    )
    wrapper = mount(ModerationPage)
    await flushPromises()

    expect(ModerationRepository.listReportedContents).toHaveBeenCalledWith({
      params: ModerationDto.toListParams({ status: REPORT_STATUSES.PENDING }, 1),
    })
  })

  it('lists the reported chapter and the reported comment with their report count', async () => {
    vi.spyOn(ModerationRepository, 'listReportedContents').mockResolvedValue(
      controllerSuccess({ data: moderationSeeder.getListApi() }),
    )
    const { reportedContents } = moderationSeeder.getList()
    wrapper = mount(ModerationPage)
    await flushPromises()

    const rows = wrapper.findAll('.moderation-page__content')
    expect(rows[0].find('.moderation-page__link').text()).toBe(reportedContents[0].chapter.title)
    expect(rows[1].find('.moderation-page__link').text()).toBe(reportedContents[1].comment.content)
    expect(rows[0].find('.moderation-page__count').text()).toBe(
      t('moderation_page.report_count', reportedContents[0].reportCount),
    )
  })

  it('links each content to its decision page', async () => {
    vi.spyOn(ModerationRepository, 'listReportedContents').mockResolvedValue(
      controllerSuccess({ data: moderationSeeder.getListApi() }),
    )
    const { reportedContents } = moderationSeeder.getList()
    wrapper = mount(ModerationPage)
    await flushPromises()

    expect(
      wrapper.findAllComponents('.moderation-page__link').map(link => link.props('to')),
    ).toEqual([
      {
        name: 'moderation-chapter',
        params: { id: reportedContents[0].id },
      },
      {
        name: 'moderation-comment',
        params: { id: reportedContents[1].id },
      },
    ])
  })

  it('offers to process each pending content from its decision page', async () => {
    vi.spyOn(ModerationRepository, 'listReportedContents').mockResolvedValue(
      controllerSuccess({ data: moderationSeeder.getListApi() }),
    )
    const { reportedContents } = moderationSeeder.getList()
    wrapper = mount(ModerationPage)
    await flushPromises()

    const openButtons = wrapper.findAllComponents('.moderation-page__open')
    expect(openButtons.map(button => button.text())).toEqual([
      t('moderation_page.process'),
      t('moderation_page.process'),
    ])
    expect(openButtons[0].props('to')).toEqual({
      name: 'moderation-chapter',
      params: { id: reportedContents[0].id },
    })
  })

  it('offers to view the decision of a processed content', async () => {
    vi.spyOn(ModerationRepository, 'listReportedContents').mockResolvedValue(
      controllerSuccess({ data: moderationSeeder.getListApi() }),
    )
    wrapper = mount(ModerationPage)
    await flushPromises()

    await wrapper.findAll('.moderation-page__status')[1].trigger('click')
    await flushPromises()

    expect(wrapper.find('.moderation-page__open').text()).toBe(t('moderation_page.view'))
  })

  it('reloads the queue on the processed reports', async () => {
    vi.spyOn(ModerationRepository, 'listReportedContents').mockResolvedValue(
      controllerSuccess({ data: moderationSeeder.getListApi() }),
    )
    wrapper = mount(ModerationPage)
    await flushPromises()

    await wrapper.findAll('.moderation-page__status')[1].trigger('click')
    await flushPromises()

    expect(ModerationRepository.listReportedContents).toHaveBeenLastCalledWith({
      params: ModerationDto.toListParams({ status: REPORT_STATUSES.PROCESSED }, 1),
    })
  })

  it('says when no content waits for a decision', async () => {
    vi.spyOn(ModerationRepository, 'listReportedContents').mockResolvedValue(
      controllerSuccess({ data: moderationSeeder.getListApi({ reported_contents: [] }) }),
    )
    wrapper = mount(ModerationPage)
    await flushPromises()

    expect(wrapper.find('.moderation-page__empty').text()).toBe(t('moderation_page.empty'))
  })
})

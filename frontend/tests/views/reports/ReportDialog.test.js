import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import ReportDialog from '@/views/reports/ReportDialog.vue'
import { ReportRepository } from '@/apis/reports/repositories/report-repository.js'
import { ReportDto } from '@/apis/reports/dtos/report-dto.js'
import { useReport } from '@/core-vue/composables/reports/use-report.js'
import { flash, form, t } from '@/services/shortcuts/services-shortcut.js'
import { useAuthStore } from '@/services/auth/src/auth-store.js'
import { STATUS } from '@/constants/ajax-constants.js'
import { ConfigLoader } from '@/config/config-loader.js'
import { controllerSuccess } from '&/utils/helpers/controller-response.js'
import { chapterSeeder } from '&/utils/seeders/chapter-seeder.js'
import { commentSeeder } from '&/utils/seeders/comment-seeder.js'
import { coverSeeder } from '&/utils/seeders/cover-seeder.js'
import { reportSeeder } from '&/utils/seeders/report-seeder.js'
import { userSeeder } from '&/utils/seeders/user-seeder.js'

describe('ReportDialog.vue', () => {
  beforeEach(() => {
    useAuthStore().setUser(userSeeder.getUser())
    flash.clearFlashes()
    form.clearErrors()
  })

  afterEach(() => {
    useReport().report.closeReport()
    vi.clearAllMocks()
  })

  it('opens on the chapter the reader chose to report', async () => {
    const chapter = chapterSeeder.getChapter()
    const wrapper = mount(ReportDialog)

    useReport().report.openChapterReport(chapter)
    await flushPromises()

    expect(wrapper.find('dialog').element.open).toBe(true)
    expect(wrapper.find('.dialog-header').text()).toContain(chapter.title)
  })

  it('offers every motive a chapter can be reported for', async () => {
    const wrapper = mount(ReportDialog)

    useReport().report.openChapterReport(chapterSeeder.getChapter())
    await flushPromises()

    const motives = wrapper
      .find('select[name="report.reason"]')
      .findAll('option')
      .map(option => option.element.value)
      .filter(Boolean)
    expect(motives).toEqual(ConfigLoader.get('report.chapterReasons'))
  })

  it('does not send the report when no motive is chosen', async () => {
    vi.spyOn(ReportRepository, 'reportChapter').mockResolvedValue(controllerSuccess())
    const wrapper = mount(ReportDialog)
    useReport().report.openChapterReport(chapterSeeder.getChapter())
    await flushPromises()

    await wrapper.find('form').trigger('submit')
    await flushPromises()

    expect(ReportRepository.reportChapter).not.toHaveBeenCalled()
    expect(form.getError('report.reason')).toBe('report_dialog.error_reason_required')
  })

  it('sends the motive and the details, then confirms and closes', async () => {
    const chapter = chapterSeeder.getChapter()
    const datas = reportSeeder.getReportData()
    vi.spyOn(ReportRepository, 'reportChapter').mockResolvedValue(controllerSuccess())
    const wrapper = mount(ReportDialog)
    useReport().report.openChapterReport(chapter)
    await flushPromises()

    await wrapper.find('select[name="report.reason"]').setValue(datas.reason)
    await wrapper.find('textarea[name="report.description"]').setValue(datas.description)
    await wrapper.find('form').trigger('submit')
    await flushPromises()

    expect(ReportRepository.reportChapter).toHaveBeenCalledWith({
      params: ReportDto.toChapterParams(chapter.id),
      body: ReportDto.toCreate(datas),
      form: 'report',
    })
    expect(flash.getFlashes().at(-1).content).toBe(t('report_dialog.sent'))
    expect(useReport().reportedContent.value).toBeUndefined()
  })

  it('replaces the form by a notice when the api refuses a second report', async () => {
    vi.spyOn(ReportRepository, 'reportChapter').mockResolvedValue({
      status: STATUS.CONFLICT,
      data: reportSeeder.getRefusalApi(),
    })
    const wrapper = mount(ReportDialog)
    useReport().report.openChapterReport(chapterSeeder.getChapter({ id: 21 }))
    await flushPromises()

    await wrapper.find('select[name="report.reason"]').setValue('spam')
    await wrapper.find('form').trigger('submit')
    await flushPromises()

    expect(wrapper.find('.report-dialog__already').text()).toBe(t('report_dialog.already_chapter'))
    expect(wrapper.find('form').exists()).toBe(false)
    expect(useReport().reportedContent.value).toBeDefined()
  })

  it('offers no form to a reader the api already knows as a reporter of the chapter', async () => {
    const wrapper = mount(ReportDialog)

    useReport().report.openChapterReport(chapterSeeder.getChapter({ isReported: true }))
    await flushPromises()

    expect(wrapper.find('.report-dialog__already').text()).toBe(t('report_dialog.already_chapter'))
    expect(wrapper.find('form').exists()).toBe(false)
  })

  it('lets the reader leave the notice by its own button', async () => {
    const wrapper = mount(ReportDialog)
    useReport().report.openChapterReport(chapterSeeder.getChapter({ isReported: true }))
    await flushPromises()

    await wrapper.find('.report-dialog__close').trigger('click')

    expect(useReport().reportedContent.value).toBeUndefined()
  })

  it('shows the notice again when the reader reopens a chapter reported a moment ago', async () => {
    vi.spyOn(ReportRepository, 'reportChapter').mockResolvedValue(controllerSuccess())
    const wrapper = mount(ReportDialog)
    useReport().report.openChapterReport(chapterSeeder.getChapter({ id: 22 }))
    await flushPromises()
    await wrapper.find('select[name="report.reason"]').setValue('spam')
    await wrapper.find('form').trigger('submit')
    await flushPromises()

    useReport().report.openChapterReport(chapterSeeder.getChapter({ id: 22 }))
    await flushPromises()

    expect(wrapper.find('.report-dialog__already').text()).toBe(t('report_dialog.already_chapter'))
  })

  it('offers the motives a comment can be reported for', async () => {
    const wrapper = mount(ReportDialog)

    useReport().report.openCommentReport(commentSeeder.getComment())
    await flushPromises()

    const motives = wrapper
      .find('select[name="report.reason"]')
      .findAll('option')
      .map(option => option.element.value)
      .filter(Boolean)
    expect(motives).toEqual(ConfigLoader.get('report.commentReasons'))
  })

  it('names the author of the comment being reported', async () => {
    const comment = commentSeeder.getComment()
    const wrapper = mount(ReportDialog)

    useReport().report.openCommentReport(comment)
    await flushPromises()

    expect(wrapper.find('.dialog-header').text()).toContain(
      t('report_dialog.title_comment', { author: comment.author.username }),
    )
  })

  it('sends the report to the comment, then confirms and closes', async () => {
    const comment = commentSeeder.getComment()
    const datas = reportSeeder.getReportData()
    vi.spyOn(ReportRepository, 'reportComment').mockResolvedValue(controllerSuccess())
    const wrapper = mount(ReportDialog)
    useReport().report.openCommentReport(comment)
    await flushPromises()

    await wrapper.find('select[name="report.reason"]').setValue(datas.reason)
    await wrapper.find('textarea[name="report.description"]').setValue(datas.description)
    await wrapper.find('form').trigger('submit')
    await flushPromises()

    expect(ReportRepository.reportComment).toHaveBeenCalledWith({
      params: ReportDto.toCommentParams(comment.id),
      body: ReportDto.toCreate(datas),
      form: 'report',
    })
    expect(flash.getFlashes().at(-1).content).toBe(t('report_dialog.sent'))
    expect(useReport().reportedContent.value).toBeUndefined()
  })

  it('offers no form on a comment the api already knows the reader reported', async () => {
    const wrapper = mount(ReportDialog)

    useReport().report.openCommentReport(commentSeeder.getComment({ isReported: true }))
    await flushPromises()

    expect(wrapper.find('.report-dialog__already').text()).toBe(t('report_dialog.already_comment'))
    expect(wrapper.find('form').exists()).toBe(false)
  })

  it('tells the reader the comment vanished when the api no longer finds it', async () => {
    vi.spyOn(ReportRepository, 'reportComment').mockResolvedValue({
      status: STATUS.NOT_FOUND,
      data: {},
    })
    const wrapper = mount(ReportDialog)
    useReport().report.openCommentReport(commentSeeder.getComment({ id: 31 }))
    await flushPromises()

    await wrapper.find('select[name="report.reason"]').setValue('spam')
    await wrapper.find('form').trigger('submit')
    await flushPromises()

    expect(wrapper.find('.report-dialog__refusal').text()).toBe(t('report_dialog.error_gone'))
  })

  it('shows the refusal the api gives to a reader who may not report', async () => {
    const refusal = reportSeeder.getRefusalApi()
    vi.spyOn(ReportRepository, 'reportComment').mockResolvedValue({
      status: STATUS.FORBIDDEN,
      data: refusal,
    })
    const wrapper = mount(ReportDialog)
    useReport().report.openCommentReport(commentSeeder.getComment({ id: 32 }))
    await flushPromises()

    await wrapper.find('select[name="report.reason"]').setValue('spam')
    await wrapper.find('form').trigger('submit')
    await flushPromises()

    expect(wrapper.find('.report-dialog__refusal').text()).toBe(refusal.message)
  })

  it('offers the motives a cover can be reported for', async () => {
    const wrapper = mount(ReportDialog)

    useReport().report.openCoverReport(coverSeeder.getCover())
    await flushPromises()

    const motives = wrapper
      .find('select[name="report.reason"]')
      .findAll('option')
      .map(option => option.element.value)
      .filter(Boolean)
    expect(motives).toEqual(ConfigLoader.get('report.coverReasons'))
  })

  it('names the illustrator of the cover being reported', async () => {
    const cover = coverSeeder.getCover()
    const wrapper = mount(ReportDialog)

    useReport().report.openCoverReport(cover)
    await flushPromises()

    expect(wrapper.find('.dialog-header').text()).toContain(
      t('report_dialog.title_cover', { author: cover.author.username }),
    )
  })

  it('sends the report to the cover, then confirms and closes', async () => {
    const cover = coverSeeder.getCover({ id: 61 })
    const datas = reportSeeder.getReportData({ reason: 'unauthorized_illustration' })
    vi.spyOn(ReportRepository, 'reportCover').mockResolvedValue(controllerSuccess())
    const wrapper = mount(ReportDialog)
    useReport().report.openCoverReport(cover)
    await flushPromises()

    await wrapper.find('select[name="report.reason"]').setValue(datas.reason)
    await wrapper.find('textarea[name="report.description"]').setValue(datas.description)
    await wrapper.find('form').trigger('submit')
    await flushPromises()

    expect(ReportRepository.reportCover).toHaveBeenCalledWith({
      params: ReportDto.toCoverParams(cover.id),
      body: ReportDto.toCreate(datas),
      form: 'report',
    })
    expect(useReport().reportedContent.value).toBeUndefined()
  })

  it('offers no form on a cover the api already knows the reader reported', async () => {
    const wrapper = mount(ReportDialog)

    useReport().report.openCoverReport(coverSeeder.getCover({ isReported: true }))
    await flushPromises()

    expect(wrapper.find('.report-dialog__already').text()).toBe(t('report_dialog.already_cover'))
    expect(wrapper.find('form').exists()).toBe(false)
  })
})

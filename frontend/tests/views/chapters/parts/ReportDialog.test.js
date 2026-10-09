import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import ReportDialog from '@/views/chapters/parts/ReportDialog.vue'
import { ReportController } from '@/apis/reports/controllers/report-controller.js'
import { useChapterReport } from '@/apis/reports/composables/use-chapter-report.js'
import { flash, form } from '@/services/shortcuts/services-shortcut.js'
import { useAuthStore } from '@/services/auth/src/auth-store.js'
import { STATUS } from '@/constants/ajax-constants.js'
import { ConfigLoader } from '@/config/config-loader.js'
import { chapterSeeder } from '&/utils/seeders/chapter-seeder.js'
import { reportSeeder } from '&/utils/seeders/report-seeder.js'
import { userSeeder } from '&/utils/seeders/user-seeder.js'

const ALREADY_MESSAGE =
  "Vous avez déjà signalé ce chapitre. Un modérateur examine votre signalement, inutile d'en envoyer un second."

describe('ReportDialog.vue', () => {
  beforeEach(() => {
    useAuthStore().setUser(userSeeder.getUser())
    flash.clearFlashes()
    form.clearErrors()
  })

  afterEach(() => {
    useChapterReport().closeChapterReport()
    vi.clearAllMocks()
  })

  it('opens on the chapter the reader chose to report', async () => {
    const chapter = chapterSeeder.getChapter()
    const wrapper = mount(ReportDialog)

    useChapterReport().openChapterReport(chapter)
    await flushPromises()

    expect(wrapper.find('dialog').element.open).toBe(true)
    expect(wrapper.find('.dialog-header').text()).toContain(chapter.title)
  })

  it('offers every motive a chapter can be reported for', async () => {
    const wrapper = mount(ReportDialog)

    useChapterReport().openChapterReport(chapterSeeder.getChapter())
    await flushPromises()

    const motives = wrapper
      .find('select[name="report.reason"]')
      .findAll('option')
      .map(option => option.element.value)
      .filter(Boolean)
    expect(motives).toEqual(ConfigLoader.get('report.chapterReasons'))
  })

  it('does not send the report when no motive is chosen', async () => {
    vi.spyOn(ReportController, 'reportChapter').mockResolvedValue({ status: STATUS.SUCCESS })
    const wrapper = mount(ReportDialog)
    useChapterReport().openChapterReport(chapterSeeder.getChapter())
    await flushPromises()

    await wrapper.find('form').trigger('submit')
    await flushPromises()

    expect(ReportController.reportChapter).not.toHaveBeenCalled()
    expect(form.getError('report.reason')).toBe('report_dialog.error_reason_required')
  })

  it('sends the motive and the details, then confirms and closes', async () => {
    const chapter = chapterSeeder.getChapter()
    const datas = reportSeeder.getReportData()
    vi.spyOn(ReportController, 'reportChapter').mockResolvedValue({ status: STATUS.SUCCESS })
    const wrapper = mount(ReportDialog)
    useChapterReport().openChapterReport(chapter)
    await flushPromises()

    await wrapper.find('select[name="report.reason"]').setValue(datas.reason)
    await wrapper.find('textarea[name="report.description"]').setValue(datas.description)
    await wrapper.find('form').trigger('submit')
    await flushPromises()

    expect(ReportController.reportChapter).toHaveBeenCalledWith(chapter.id, datas)
    expect(flash.getFlashes().at(-1).content).toBe(
      "Signalement envoyé, un modérateur va l'examiner.",
    )
    expect(useChapterReport().reportedChapter.value).toBeUndefined()
  })

  it('replaces the form by a notice when the api refuses a second report', async () => {
    vi.spyOn(ReportController, 'reportChapter').mockResolvedValue({
      status: STATUS.CONFLICT,
      data: { message: 'Vous avez déjà signalé ce contenu' },
    })
    const wrapper = mount(ReportDialog)
    useChapterReport().openChapterReport(chapterSeeder.getChapter({ id: 21 }))
    await flushPromises()

    await wrapper.find('select[name="report.reason"]').setValue('spam')
    await wrapper.find('form').trigger('submit')
    await flushPromises()

    expect(wrapper.find('.report-dialog__already').text()).toBe(ALREADY_MESSAGE)
    expect(wrapper.find('form').exists()).toBe(false)
    expect(useChapterReport().reportedChapter.value).toBeDefined()
  })

  it('offers no form to a reader the api already knows as a reporter of the chapter', async () => {
    const wrapper = mount(ReportDialog)

    useChapterReport().openChapterReport(chapterSeeder.getChapter({ isReported: true }))
    await flushPromises()

    expect(wrapper.find('.report-dialog__already').text()).toBe(ALREADY_MESSAGE)
    expect(wrapper.find('form').exists()).toBe(false)
  })

  it('lets the reader leave the notice by its own button', async () => {
    const wrapper = mount(ReportDialog)
    useChapterReport().openChapterReport(chapterSeeder.getChapter({ isReported: true }))
    await flushPromises()

    await wrapper.find('.report-dialog__close').trigger('click')

    expect(useChapterReport().reportedChapter.value).toBeUndefined()
  })

  it('shows the notice again when the reader reopens a chapter reported a moment ago', async () => {
    vi.spyOn(ReportController, 'reportChapter').mockResolvedValue({ status: STATUS.SUCCESS })
    const wrapper = mount(ReportDialog)
    useChapterReport().openChapterReport(chapterSeeder.getChapter({ id: 22 }))
    await flushPromises()
    await wrapper.find('select[name="report.reason"]').setValue('spam')
    await wrapper.find('form').trigger('submit')
    await flushPromises()

    useChapterReport().openChapterReport(chapterSeeder.getChapter({ id: 22 }))
    await flushPromises()

    expect(wrapper.find('.report-dialog__already').text()).toBe(ALREADY_MESSAGE)
  })
})

import { describe, it, expect, vi, afterEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import ResumeReadingList from '@/views/readings/parts/ResumeReadingList.vue'
import { ReadingProgressRepository } from '@/apis/reading-progress/repositories/reading-progress-repository.js'
import { ReadingProgressDto } from '@/apis/reading-progress/dtos/reading-progress-dto.js'
import { t } from '@/services/shortcuts/services-shortcut.js'
import { controllerError, controllerSuccess } from '&/utils/helpers/controller-response.js'
import { readingProgressSeeder } from '&/utils/seeders/reading-progress-seeder.js'

describe('ResumeReadingList.vue', () => {
  let wrapper

  afterEach(() => {
    wrapper?.unmount()
    wrapper = undefined
    vi.clearAllMocks()
  })

  it('offers to resume each novel at the last chapter read', async () => {
    const listApi = readingProgressSeeder.getListApi()
    vi.spyOn(ReadingProgressRepository, 'list').mockResolvedValue(
      controllerSuccess({ data: listApi }),
    )
    const progresses = ReadingProgressDto.fromList(listApi.progresses)

    wrapper = mount(ResumeReadingList)
    await flushPromises()

    expect(wrapper.findAll('.resume-reading-list__item')).toHaveLength(progresses.length)
    expect(wrapper.find('.resume-reading-list__item').text()).toContain(
      t('resume_reading_list.stopped_at', {
        title: progresses[0].chapter.title,
        date: progresses[0].readAtFormat,
      }),
    )
    expect(wrapper.findAllComponents({ name: 'RouterLink' }).map(link => link.props('to'))).toEqual(
      progresses.map(progress => ({
        name: 'chapter-read',
        params: { slug: progress.chapter.novel.slug, id: progress.chapter.id },
      })),
    )
  })

  it('says so when no novel has been started', async () => {
    vi.spyOn(ReadingProgressRepository, 'list').mockResolvedValue(
      controllerSuccess({ data: readingProgressSeeder.getListApi({ progresses: [] }) }),
    )

    wrapper = mount(ResumeReadingList)
    await flushPromises()

    expect(wrapper.find('.resume-reading-list__empty').text()).toBe(t('resume_reading_list.empty'))
  })

  it('does not claim the list is empty when it could not be loaded', async () => {
    vi.spyOn(ReadingProgressRepository, 'list').mockResolvedValue(controllerError())

    wrapper = mount(ResumeReadingList)
    await flushPromises()

    expect(wrapper.find('.resume-reading-list__empty').exists()).toBe(false)
  })
})

import { describe, it, expect, vi, afterEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import ReadingHistoryList from '@/views/readings/parts/ReadingHistoryList.vue'
import { ChapterReadRepository } from '@/apis/chapter-reads/repositories/chapter-read-repository.js'
import { ChapterReadDto } from '@/apis/chapter-reads/dtos/chapter-read-dto.js'
import { t } from '@/services/shortcuts/services-shortcut.js'
import { controllerSuccess } from '&/utils/helpers/controller-response.js'
import { chapterReadSeeder } from '&/utils/seeders/chapter-read-seeder.js'
import { paginationSeeder } from '&/utils/seeders/pagination-seeder.js'
import { chapterSeeder } from '&/utils/seeders/chapter-seeder.js'

describe('ReadingHistoryList.vue', () => {
  let wrapper

  afterEach(() => {
    wrapper?.unmount()
    wrapper = undefined
    vi.clearAllMocks()
  })

  it('retraces the chapters read, each leading back to its chapter', async () => {
    const listApi = chapterReadSeeder.getListApi()
    vi.spyOn(ChapterReadRepository, 'list').mockResolvedValue(controllerSuccess({ data: listApi }))
    const reads = ChapterReadDto.fromList(listApi.reads)

    wrapper = mount(ReadingHistoryList)
    await flushPromises()

    expect(
      wrapper.findAll('.reading-history-list__chapter').map(chapter => chapter.text()),
    ).toEqual(reads.map(read => read.chapter.title))
    expect(wrapper.findAll('.reading-history-list__date').map(date => date.text())).toEqual(
      reads.map(read => read.readAtFormat),
    )
    expect(wrapper.findAllComponents({ name: 'RouterLink' }).map(link => link.props('to'))).toEqual(
      reads.map(read => ({
        name: 'chapter-read',
        params: { slug: read.chapter.novel.slug, id: read.chapter.id },
      })),
    )
  })

  it('loads the next page of the history on demand', async () => {
    const firstPage = chapterReadSeeder.getListApi({
      meta: paginationSeeder.getMetaApi({ last_page: 2 }),
    })
    const secondPage = chapterReadSeeder.getListApi({
      reads: [
        chapterReadSeeder.getChapterReadApi({ chapter: chapterSeeder.getChapterApi({ id: 99 }) }),
      ],
      meta: paginationSeeder.getMetaApi({ current_page: 2, last_page: 2 }),
    })
    vi.spyOn(ChapterReadRepository, 'list')
      .mockResolvedValueOnce(controllerSuccess({ data: firstPage }))
      .mockResolvedValueOnce(controllerSuccess({ data: secondPage }))

    wrapper = mount(ReadingHistoryList)
    await flushPromises()
    await wrapper.find('.reading-history-list__more').trigger('click')
    await flushPromises()

    expect(ChapterReadRepository.list).toHaveBeenLastCalledWith({
      params: ChapterReadDto.toListParams(2),
    })
    expect(wrapper.findAll('.reading-history-list__item')).toHaveLength(3)
  })

  it('says so when nothing has been read yet', async () => {
    vi.spyOn(ChapterReadRepository, 'list').mockResolvedValue(
      controllerSuccess({ data: chapterReadSeeder.getListApi({ reads: [] }) }),
    )

    wrapper = mount(ReadingHistoryList)
    await flushPromises()

    expect(wrapper.find('.reading-history-list__empty').text()).toBe(
      t('reading_history_list.empty'),
    )
  })
})

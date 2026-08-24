import { describe, it, expect, vi, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { useChapterReading } from '@/apis/chapters/composables/use-chapter-reading.js'
import { createReadingStore, READING_STORE_KEY } from '@/apis/chapters/stores/reading-store.js'
import { createNovelStore, NOVEL_STORE_KEY } from '@/apis/novels/stores/novel-store.js'
import { ChapterController } from '@/apis/chapters/controllers/chapter-controller.js'
import { chapterSeeder } from '&/utils/seeders/chapter-seeder.js'
import { controllerSuccess, controllerError } from '&/utils/helpers/controller-response.js'

describe('use-chapter-reading', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('feeds the reading store and the novel store from a single request', async () => {
    const reading = chapterSeeder.getReading()
    vi.spyOn(ChapterController, 'reading').mockResolvedValue(controllerSuccess(reading))
    const readingStore = createReadingStore()
    const novelStore = createNovelStore()
    let composable
    mount(
      {
        template: '<div />',
        setup() {
          composable = useChapterReading()
          return {}
        },
      },
      {
        global: {
          provide: { [READING_STORE_KEY]: readingStore, [NOVEL_STORE_KEY]: novelStore },
        },
      },
    )

    await composable.chapterReading.load('nuit-virage', reading.chapter.id)

    expect(readingStore.chapter.value).toEqual(reading.chapter)
    expect(novelStore.selectedNovel.value).toEqual(reading.novel)
  })

  it('leaves the stores untouched when the chapter cannot be read', async () => {
    const failure = controllerError(404, 'introuvable')
    vi.spyOn(ChapterController, 'reading').mockResolvedValue(failure)
    const readingStore = createReadingStore()
    const novelStore = createNovelStore()
    let composable
    mount(
      {
        template: '<div />',
        setup() {
          composable = useChapterReading()
          return {}
        },
      },
      {
        global: {
          provide: { [READING_STORE_KEY]: readingStore, [NOVEL_STORE_KEY]: novelStore },
        },
      },
    )

    const result = await composable.chapterReading.load('nuit-virage', 999)

    expect(result).toBe(failure)
    expect(readingStore.chapter.value).toBeUndefined()
    expect(novelStore.selectedNovel.value).toBeUndefined()
  })
})

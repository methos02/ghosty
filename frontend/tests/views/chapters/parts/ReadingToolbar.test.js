import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import ReadingToolbar from '@/views/chapters/parts/ReadingToolbar.vue'
import { useReport } from '@/core-vue/composables/reports/use-report.js'
import { REPORTED_CONTENT_TYPES } from '@/constants/moderation-constants.js'
import { useChapterComments } from '@/core-vue/composables/comments/use-chapter-comments.js'
import { useAuth } from '@/services/auth/src/use-auth.js'
import { useAuthStore } from '@/services/auth/src/auth-store.js'
import { createNovelStore, NOVEL_STORE_KEY } from '@/core-vue/stores/novels/novel-store.js'
import { createReadingStore, READING_STORE_KEY } from '@/core-vue/stores/chapters/reading-store.js'
import {
  createReadingSettingsStore,
  READING_SETTINGS_STORE_KEY,
} from '@/core-vue/stores/chapters/reading-settings-store.js'
import { chapterSeeder } from '&/utils/seeders/chapter-seeder.js'
import { novelSeeder } from '&/utils/seeders/novel-seeder.js'
import { userSeeder } from '&/utils/seeders/user-seeder.js'

describe('ReadingToolbar.vue', () => {
  beforeEach(() => {
    useAuthStore().clear()
    useAuth().closeDialogs()
  })

  afterEach(() => {
    useReport().report.closeReport()
    useChapterComments().closeChapterComments()
  })

  it('hands the chapter being read to the report dialog', async () => {
    const chapter = chapterSeeder.getChapter()
    useAuthStore().setUser(userSeeder.getUser({ id: chapter.author.id + 1 }))

    const novelStore = createNovelStore()
    const readingStore = createReadingStore()
    novelStore.setSelectedNovel(novelSeeder.getNovel())
    readingStore.setReading({ ...chapterSeeder.getReading(), chapter })
    const wrapper = mount(ReadingToolbar, {
      global: {
        provide: {
          [NOVEL_STORE_KEY]: novelStore,
          [READING_STORE_KEY]: readingStore,
          [READING_SETTINGS_STORE_KEY]: createReadingSettingsStore(),
        },
      },
    })
    await wrapper.find('.reading-toolbar__report').trigger('click')

    expect(useReport().reportedContent.value).toEqual({
      type: REPORTED_CONTENT_TYPES.CHAPTER,
      content: chapter,
    })
  })

  it('does not offer the author to report their own chapter', () => {
    const chapter = chapterSeeder.getChapter()
    useAuthStore().setUser(userSeeder.getUser({ id: chapter.author.id }))

    const novelStore = createNovelStore()
    const readingStore = createReadingStore()
    novelStore.setSelectedNovel(novelSeeder.getNovel())
    readingStore.setReading({ ...chapterSeeder.getReading(), chapter })
    const wrapper = mount(ReadingToolbar, {
      global: {
        provide: {
          [NOVEL_STORE_KEY]: novelStore,
          [READING_STORE_KEY]: readingStore,
          [READING_SETTINGS_STORE_KEY]: createReadingSettingsStore(),
        },
      },
    })

    expect(wrapper.find('.reading-toolbar__report').exists()).toBe(false)
  })

  it('asks a visitor to sign in before opening the report dialog', async () => {
    const novelStore = createNovelStore()
    const readingStore = createReadingStore()
    novelStore.setSelectedNovel(novelSeeder.getNovel())
    readingStore.setReading({ ...chapterSeeder.getReading(), chapter: chapterSeeder.getChapter() })
    const wrapper = mount(ReadingToolbar, {
      global: {
        provide: {
          [NOVEL_STORE_KEY]: novelStore,
          [READING_STORE_KEY]: readingStore,
          [READING_SETTINGS_STORE_KEY]: createReadingSettingsStore(),
        },
      },
    })

    await wrapper.find('.reading-toolbar__report').trigger('click')

    expect(useReport().reportedContent.value).toBeUndefined()
    expect(useAuth().showLoginDialog.value).toBe(true)
  })

  it('offers to follow the branch of a published chapter', () => {
    const novelStore = createNovelStore()
    const readingStore = createReadingStore()
    novelStore.setSelectedNovel(novelSeeder.getNovel())
    readingStore.setReading({ ...chapterSeeder.getReading(), chapter: chapterSeeder.getChapter() })
    const wrapper = mount(ReadingToolbar, {
      global: {
        provide: {
          [NOVEL_STORE_KEY]: novelStore,
          [READING_STORE_KEY]: readingStore,
          [READING_SETTINGS_STORE_KEY]: createReadingSettingsStore(),
        },
      },
    })

    expect(wrapper.find('.follow-button').exists()).toBe(true)
  })

  it('does not offer to follow a draft, which has no branch yet', () => {
    const novelStore = createNovelStore()
    const readingStore = createReadingStore()
    novelStore.setSelectedNovel(novelSeeder.getNovel())
    readingStore.setReading({
      ...chapterSeeder.getReading(),
      chapter: chapterSeeder.getChapter({ isDraft: true }),
    })
    const wrapper = mount(ReadingToolbar, {
      global: {
        provide: {
          [NOVEL_STORE_KEY]: novelStore,
          [READING_STORE_KEY]: readingStore,
          [READING_SETTINGS_STORE_KEY]: createReadingSettingsStore(),
        },
      },
    })

    expect(wrapper.find('.follow-button').exists()).toBe(false)
  })

  it('opens the comments of the chapter being read', async () => {
    const chapter = chapterSeeder.getChapter()
    const novelStore = createNovelStore()
    const readingStore = createReadingStore()
    novelStore.setSelectedNovel(novelSeeder.getNovel())
    readingStore.setReading({ ...chapterSeeder.getReading(), chapter })
    const wrapper = mount(ReadingToolbar, {
      global: {
        provide: {
          [NOVEL_STORE_KEY]: novelStore,
          [READING_STORE_KEY]: readingStore,
          [READING_SETTINGS_STORE_KEY]: createReadingSettingsStore(),
        },
      },
    })

    await wrapper.find('.reading-toolbar__comments').trigger('click')

    expect(useChapterComments().commentedChapter.value).toEqual(chapter)
  })

  it('shows how many comments the chapter has received', () => {
    const chapter = chapterSeeder.getChapter({ commentCount: 4 })
    const novelStore = createNovelStore()
    const readingStore = createReadingStore()
    novelStore.setSelectedNovel(novelSeeder.getNovel())
    readingStore.setReading({ ...chapterSeeder.getReading(), chapter })
    const wrapper = mount(ReadingToolbar, {
      global: {
        provide: {
          [NOVEL_STORE_KEY]: novelStore,
          [READING_STORE_KEY]: readingStore,
          [READING_SETTINGS_STORE_KEY]: createReadingSettingsStore(),
        },
      },
    })

    expect(wrapper.find('.reading-toolbar__comment-count').text()).toBe(
      String(chapter.commentCount),
    )
  })

  it('offers no comments on a draft', () => {
    const novelStore = createNovelStore()
    const readingStore = createReadingStore()
    novelStore.setSelectedNovel(novelSeeder.getNovel())
    readingStore.setReading({
      ...chapterSeeder.getReading(),
      chapter: chapterSeeder.getChapter({ isDraft: true }),
    })
    const wrapper = mount(ReadingToolbar, {
      global: {
        provide: {
          [NOVEL_STORE_KEY]: novelStore,
          [READING_STORE_KEY]: readingStore,
          [READING_SETTINGS_STORE_KEY]: createReadingSettingsStore(),
        },
      },
    })

    expect(wrapper.find('.reading-toolbar__comments').exists()).toBe(false)
  })
})

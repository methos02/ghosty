import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import ReadingActionBar from '@/views/chapters/parts/ReadingActionBar.vue'
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

const mountBar = ({ chapter }) => {
  const novelStore = createNovelStore()
  const readingStore = createReadingStore()
  novelStore.setSelectedNovel(novelSeeder.getNovel())
  readingStore.setReading({ ...chapterSeeder.getReading(), chapter })

  return mount(ReadingActionBar, {
    global: {
      provide: {
        [NOVEL_STORE_KEY]: novelStore,
        [READING_STORE_KEY]: readingStore,
        [READING_SETTINGS_STORE_KEY]: createReadingSettingsStore(),
      },
    },
  })
}

describe('ReadingActionBar.vue', () => {
  beforeEach(() => {
    useAuthStore().clear()
    useAuth().closeDialogs()
  })

  afterEach(() => {
    useReport().report.closeReport()
    useChapterComments().closeChapterComments()
  })

  it('opens the comments of the chapter being read', async () => {
    const chapter = chapterSeeder.getChapter({ commentCount: 4 })
    const wrapper = mountBar({ chapter })

    expect(wrapper.find('.reading-action-bar__comments').text()).toBe('4')

    await wrapper.find('.reading-action-bar__comments').trigger('click')

    expect(useChapterComments().commentedChapter.value).toEqual(chapter)
  })

  it('hands the chapter being read to the report dialog', async () => {
    const chapter = chapterSeeder.getChapter()
    useAuthStore().setUser(userSeeder.getUser({ id: chapter.author.id + 1 }))
    const wrapper = mountBar({ chapter })

    await wrapper.find('.reading-action-bar__report').trigger('click')

    expect(useReport().reportedContent.value).toEqual({
      type: REPORTED_CONTENT_TYPES.CHAPTER,
      content: chapter,
    })
  })

  it('does not offer the author to report their own chapter', () => {
    const chapter = chapterSeeder.getChapter()
    useAuthStore().setUser(userSeeder.getUser({ id: chapter.author.id }))
    const wrapper = mountBar({ chapter })

    expect(wrapper.find('.reading-action-bar__report').exists()).toBe(false)
  })

  it('offers neither following nor comments on a draft', () => {
    const wrapper = mountBar({ chapter: chapterSeeder.getChapter({ isDraft: true }) })

    expect(wrapper.find('.reading-action-bar__comments').exists()).toBe(false)
    expect(wrapper.find('.follow-button').exists()).toBe(false)
  })
})

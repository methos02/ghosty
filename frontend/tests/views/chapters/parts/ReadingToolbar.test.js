import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import ReadingToolbar from '@/views/chapters/parts/ReadingToolbar.vue'
import { useChapterReport } from '@/apis/reports/composables/use-chapter-report.js'
import { useAuth } from '@/services/auth/src/use-auth.js'
import { useAuthStore } from '@/services/auth/src/auth-store.js'
import { createNovelStore, NOVEL_STORE_KEY } from '@/apis/novels/stores/novel-store.js'
import { createReadingStore, READING_STORE_KEY } from '@/apis/chapters/stores/reading-store.js'
import {
  createReadingSettingsStore,
  READING_SETTINGS_STORE_KEY,
} from '@/apis/chapters/stores/reading-settings-store.js'
import { chapterSeeder } from '&/utils/seeders/chapter-seeder.js'
import { novelSeeder } from '&/utils/seeders/novel-seeder.js'
import { userSeeder } from '&/utils/seeders/user-seeder.js'

const mountToolbar = chapter => {
  const novelStore = createNovelStore()
  const readingStore = createReadingStore()
  novelStore.setSelectedNovel(novelSeeder.getNovel())
  readingStore.setReading({ ...chapterSeeder.getReading(), chapter })

  return mount(ReadingToolbar, {
    global: {
      provide: {
        [NOVEL_STORE_KEY]: novelStore,
        [READING_STORE_KEY]: readingStore,
        [READING_SETTINGS_STORE_KEY]: createReadingSettingsStore(),
      },
    },
  })
}

describe('ReadingToolbar.vue', () => {
  beforeEach(() => {
    useAuthStore().clear()
    useAuth().closeDialogs()
  })

  afterEach(() => {
    useChapterReport().closeChapterReport()
  })

  it('hands the chapter being read to the report dialog', async () => {
    const chapter = chapterSeeder.getChapter()
    useAuthStore().setUser(userSeeder.getUser({ id: chapter.author.id + 1 }))

    const wrapper = mountToolbar(chapter)
    await wrapper.find('.reading-toolbar__report').trigger('click')

    expect(useChapterReport().reportedChapter.value).toEqual(chapter)
  })

  it('does not offer the author to report their own chapter', () => {
    const chapter = chapterSeeder.getChapter()
    useAuthStore().setUser(userSeeder.getUser({ id: chapter.author.id }))

    const wrapper = mountToolbar(chapter)

    expect(wrapper.find('.reading-toolbar__report').exists()).toBe(false)
  })

  it('asks a visitor to sign in before opening the report dialog', async () => {
    const wrapper = mountToolbar(chapterSeeder.getChapter())

    await wrapper.find('.reading-toolbar__report').trigger('click')

    expect(useChapterReport().reportedChapter.value).toBeUndefined()
    expect(useAuth().showLoginDialog.value).toBe(true)
  })
})

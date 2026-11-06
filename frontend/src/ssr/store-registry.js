import { createAuthStore, AUTH_STORE_KEY } from '@/services/auth/src/auth-store.js'
import { createNovelStore, NOVEL_STORE_KEY } from '@/apis/novels/stores/novel-store.js'
import { createChapterStore, CHAPTER_STORE_KEY } from '@/apis/chapters/stores/chapter-store.js'
import { createReadingStore, READING_STORE_KEY } from '@/apis/chapters/stores/reading-store.js'
import { createTreeStore, TREE_STORE_KEY } from '@/apis/chapters/stores/tree-store.js'
import {
  createReadingSettingsStore,
  READING_SETTINGS_STORE_KEY,
} from '@/apis/chapters/stores/reading-settings-store.js'
import {
  createNovelFilterStore,
  NOVEL_FILTER_STORE_KEY,
} from '@/apis/novels/stores/novel-filter-store.js'

const STORE_ENTRIES = [
  {
    name: 'auth',
    key: AUTH_STORE_KEY,
    create: createAuthStore,
  },
  {
    name: 'novel',
    key: NOVEL_STORE_KEY,
    create: createNovelStore,
  },
  {
    name: 'chapter',
    key: CHAPTER_STORE_KEY,
    create: createChapterStore,
  },
  {
    name: 'reading',
    key: READING_STORE_KEY,
    create: createReadingStore,
  },
  {
    name: 'tree',
    key: TREE_STORE_KEY,
    create: createTreeStore,
  },
  {
    name: 'readingSettings',
    key: READING_SETTINGS_STORE_KEY,
    create: createReadingSettingsStore,
  },
  {
    name: 'filter',
    key: NOVEL_FILTER_STORE_KEY,
    create: createNovelFilterStore,
  },
]

const createStores = () =>
  Object.fromEntries(STORE_ENTRIES.map(entry => [entry.name, entry.create()]))

const hydrateStores = (stores, snapshot) => {
  if (!snapshot) {
    return
  }

  for (const entry of STORE_ENTRIES) {
    stores[entry.name].hydrate(snapshot[entry.name])
  }
}

const provideStores = (app, stores) => {
  for (const entry of STORE_ENTRIES) {
    app.provide(entry.key, stores[entry.name])
  }
}

const serializeStores = stores =>
  Object.fromEntries(STORE_ENTRIES.map(entry => [entry.name, stores[entry.name].serialize()]))

export const storeRegistry = {
  createStores,
  hydrateStores,
  provideStores,
  serializeStores,
}

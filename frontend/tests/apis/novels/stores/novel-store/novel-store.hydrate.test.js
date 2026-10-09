import { describe, it, expect } from 'vitest'
import { createNovelStore } from '@/apis/novels/stores/novel-store.js'
import { novelSeeder } from '&/utils/seeders/novel-seeder.js'
import { paginationSeeder } from '&/utils/seeders/pagination-seeder.js'

describe('novel-store', () => {
  describe('hydrate', () => {
    it('restores the grid and the opened novel from a snapshot', () => {
      const store = createNovelStore()
      const snapshot = {
        novels: novelSeeder.getNovels(2),
        pagination: paginationSeeder.getPagination(),
        selectedNovel: novelSeeder.getNovel(),
      }

      store.hydrate(snapshot)

      expect(store.serialize()).toEqual(snapshot)
    })
  })
})

import { describe, it, expect, afterEach } from 'vitest'
import { useCoverStore } from '@/core-vue/stores/covers/cover-store.js'
import { coverSeeder } from '&/utils/seeders/cover-seeder.js'

describe('cover-store', () => {
  afterEach(() => {
    useCoverStore().coverStore.clear()
  })

  describe('setOfficialCoverId', () => {
    it('stores the official cover the api elected', () => {
      const { officialCoverId, coverStore } = useCoverStore()
      const [, alternative] = coverSeeder.getCovers()
      coverStore.setNovelCovers(coverSeeder.getNovelCovers())

      coverStore.setOfficialCoverId(alternative.id)

      expect(officialCoverId.value).toBe(alternative.id)
    })
  })
})

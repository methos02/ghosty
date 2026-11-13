import { describe, it, expect, afterEach } from 'vitest'
import { useCoverStore } from '@/core-vue/stores/covers/cover-store.js'
import { coverSeeder } from '&/utils/seeders/cover-seeder.js'

describe('cover-store', () => {
  afterEach(() => {
    useCoverStore().coverStore.clear()
  })

  describe('addCover', () => {
    it('appends the proposed cover and remembers it as the cover of the reader', () => {
      const { covers, myCoverId, coverStore } = useCoverStore()
      const novelCovers = coverSeeder.getNovelCovers()
      const proposed = coverSeeder.getCover({
        id: 9,
        isOfficial: false,
      })
      coverStore.setNovelCovers(novelCovers)

      coverStore.addCover(proposed)

      expect(covers.value).toEqual([...novelCovers.covers, proposed])
      expect(myCoverId.value).toBe(proposed.id)
    })
  })
})

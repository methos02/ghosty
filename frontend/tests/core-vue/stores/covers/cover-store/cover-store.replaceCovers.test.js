import { describe, it, expect, afterEach } from 'vitest'
import { useCoverStore } from '@/core-vue/stores/covers/cover-store.js'
import { coverSeeder } from '&/utils/seeders/cover-seeder.js'

describe('cover-store', () => {
  afterEach(() => {
    useCoverStore().coverStore.clear()
  })

  describe('replaceCovers', () => {
    it('replaces in place the covers the api returned', () => {
      const { covers, coverStore } = useCoverStore()
      const [official, alternative] = coverSeeder.getCovers()
      const replacedOfficial = coverSeeder.getCover({ id: official.id, isLiked: false })
      const replacedAlternative = coverSeeder.getCover({ id: alternative.id, likeCount: 0 })
      coverStore.setNovelCovers(coverSeeder.getNovelCovers())

      coverStore.replaceCovers([replacedAlternative, replacedOfficial])

      expect(covers.value).toEqual([replacedOfficial, replacedAlternative])
    })

    it('ignores a cover the store does not hold', () => {
      const { covers, coverStore } = useCoverStore()
      const novelCovers = coverSeeder.getNovelCovers()
      coverStore.setNovelCovers(novelCovers)

      coverStore.replaceCovers([coverSeeder.getCover({ id: 99 })])

      expect(covers.value).toEqual(novelCovers.covers)
    })
  })
})

import { describe, it, expect, afterEach } from 'vitest'
import { useCoverStore } from '@/core-vue/stores/covers/cover-store.js'
import { coverSeeder } from '&/utils/seeders/cover-seeder.js'

describe('cover-store', () => {
  afterEach(() => {
    useCoverStore().coverStore.clear()
  })

  describe('setCommentCount', () => {
    it('updates the comment count of the commented cover only', () => {
      const { covers, coverStore } = useCoverStore()
      const [official, alternative] = coverSeeder.getCovers()
      coverStore.setNovelCovers(coverSeeder.getNovelCovers())

      coverStore.setCommentCount(alternative.id, alternative.commentCount + 1)

      expect(covers.value).toEqual([
        official,
        {
          ...alternative,
          commentCount: alternative.commentCount + 1,
        },
      ])
    })
  })
})

import { describe, it, expect, afterEach } from 'vitest'
import { useCommentStore } from '@/core-vue/stores/comments/comment-store.js'
import { commentSeeder } from '&/utils/seeders/comment-seeder.js'

describe('comment-store', () => {
  afterEach(() => {
    useCommentStore().commentStore.clear()
  })

  describe('addComments', () => {
    it('appends the loaded page after the comments already shown', () => {
      const { comments, commentStore } = useCommentStore()
      const firstPage = commentSeeder.getComments(1)
      const secondPage = [commentSeeder.getComment({ id: 99 })]

      commentStore.addComments(firstPage)
      commentStore.addComments(secondPage)

      expect(comments.value).toEqual([...firstPage, ...secondPage])
    })

    it('skips a comment already shown, pushed down a page by a newer one', () => {
      const { comments, commentStore } = useCommentStore()
      const [first, second] = commentSeeder.getComments(2)
      commentStore.addComments([first, second])

      commentStore.addComments([second])

      expect(comments.value).toEqual([first, second])
    })
  })
})

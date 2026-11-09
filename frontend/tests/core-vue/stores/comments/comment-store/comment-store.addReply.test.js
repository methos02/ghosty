import { describe, it, expect, afterEach } from 'vitest'
import { useCommentStore } from '@/core-vue/stores/comments/comment-store.js'
import { commentSeeder } from '&/utils/seeders/comment-seeder.js'

describe('comment-store', () => {
  afterEach(() => {
    useCommentStore().commentStore.clear()
  })

  describe('addReply', () => {
    it('appends the reply after the existing replies of its parent only', () => {
      const { comments, commentStore } = useCommentStore()
      const parent = commentSeeder.getCommentWithReply()
      const other = commentSeeder.getComment({ id: 8 })
      const reply = commentSeeder.getReply({ id: 71 })
      commentStore.addComments([parent, other])

      commentStore.addReply(reply)

      expect(comments.value).toEqual([{ ...parent, replies: [...parent.replies, reply] }, other])
    })
  })
})

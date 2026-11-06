import { describe, it, expect, afterEach } from 'vitest'
import { useCommentStore } from '@/apis/comments/stores/comment-store.js'
import { commentSeeder } from '&/utils/seeders/comment-seeder.js'

describe('comment-store', () => {
  afterEach(() => {
    useCommentStore().commentStore.clear()
  })

  describe('addComment', () => {
    it('puts the new comment on top of the loaded ones', () => {
      const { comments, commentStore } = useCommentStore()
      const loaded = commentSeeder.getComments(1)
      const created = commentSeeder.getComment({ id: 99 })
      commentStore.addComments(loaded)

      commentStore.addComment(created)

      expect(comments.value).toEqual([created, ...loaded])
    })
  })
})

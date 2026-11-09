import { describe, it, expect, afterEach } from 'vitest'
import { useCommentStore } from '@/core-vue/stores/comments/comment-store.js'
import { commentSeeder } from '&/utils/seeders/comment-seeder.js'

describe('comment-store', () => {
  afterEach(() => {
    useCommentStore().commentStore.clear()
  })

  describe('removeComment', () => {
    it('removes a reply from the replies of its parent', () => {
      const { comments, commentStore } = useCommentStore()
      const parent = commentSeeder.getCommentWithReply()
      commentStore.addComments([parent])

      commentStore.removeComment(parent.replies[0])

      expect(comments.value).toEqual([{ ...parent, replies: [] }])
    })

    it('keeps a deleted trace of a comment that still has replies', () => {
      const { comments, commentStore } = useCommentStore()
      const parent = commentSeeder.getCommentWithReply()
      commentStore.addComments([parent])

      commentStore.removeComment(parent)

      expect(comments.value).toEqual([
        {
          ...parent,
          author: undefined,
          content: '',
          isDeleted: true,
        },
      ])
    })

    it('removes a comment without replies from the thread', () => {
      const { comments, commentStore } = useCommentStore()
      const [first, second] = commentSeeder.getComments(2)
      commentStore.addComments([first, second])

      commentStore.removeComment(first)

      expect(comments.value).toEqual([second])
    })

    it('removes the deleted trace once its last reply is removed', () => {
      const { comments, commentStore } = useCommentStore()
      const trace = commentSeeder.getDeletedComment()
      commentStore.addComments([trace])

      commentStore.removeComment(trace.replies[0])

      expect(comments.value).toEqual([])
    })
  })
})

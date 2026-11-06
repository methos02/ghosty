import { describe, it, expect, afterEach } from 'vitest'
import { validateCommentForm } from '@/apis/comments/formRequest/comment-form-request.js'
import { form } from '@/services/shortcuts/services-shortcut.js'
import { ConfigLoader } from '@/config/config-loader.js'
import { commentSeeder } from '&/utils/seeders/comment-seeder.js'

describe('comment-form-request', () => {
  afterEach(() => {
    form.clearErrors()
  })

  describe('validateCommentForm', () => {
    it('rejects an empty content as required', () => {
      const validation = validateCommentForm(
        commentSeeder.getCreateForm({ content: '' }),
        'comment',
      )

      expect(validation.valid).toBe(false)
      expect(form.getError('comment.content')).toBe('comment_fields.error_content_required')
    })

    it('rejects a content made only of whitespace as required', () => {
      const validation = validateCommentForm(
        commentSeeder.getCreateForm({ content: ' \n\t ' }),
        'comment',
      )

      expect(validation.valid).toBe(false)
      expect(form.getError('comment.content')).toBe('comment_fields.error_content_required')
    })

    it('rejects a content one character longer than the configured maximum as too long', () => {
      const content = 'a'.repeat(ConfigLoader.get('comment.contentMaxLength') + 1)

      const validation = validateCommentForm(commentSeeder.getCreateForm({ content }), 'comment')

      expect(validation.valid).toBe(false)
      expect(form.getError('comment.content')).toBe('comment_fields.error_content_size_max')
    })

    it('accepts a content exactly as long as the configured maximum', () => {
      const content = 'a'.repeat(ConfigLoader.get('comment.contentMaxLength'))

      expect(validateCommentForm(commentSeeder.getCreateForm({ content }), 'comment').valid).toBe(
        true,
      )
    })

    it('puts the error under the name of the validated form', () => {
      validateCommentForm(commentSeeder.getCreateForm({ content: '' }), 'reply')

      expect(form.getError('reply.content')).toBe('comment_fields.error_content_required')
    })
  })
})

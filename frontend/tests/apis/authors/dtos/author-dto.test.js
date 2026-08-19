import { describe, it, expect } from 'vitest'
import { AuthorDto } from '@/apis/authors/dtos/author-dto.js'

describe('author-dto', () => {
  describe('fromShow', () => {
    it('keeps only id and username', () => {
      const api = { id: 7, username: 'GhostWriter', email: 'secret@ghosty.test', roles: ['user'] }

      const result = AuthorDto.fromShow(api)

      expect(result).toEqual({ id: 7, username: 'GhostWriter' })
    })
  })
})

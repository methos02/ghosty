import { describe, it, expect } from 'vitest'
import { chapterTreeHelper } from '@/core/helpers/chapter-tree-helper.js'

describe('chapter-tree-helper', () => {
  describe('moveBranchEnd', () => {
    it('continues the branch with a chapter it does not hold yet', () => {
      expect(chapterTreeHelper.moveBranchEnd([10, 11], 13)).toEqual([10, 11, 13])
    })

    it('drops what came after the chapter the reader comes back to', () => {
      expect(chapterTreeHelper.moveBranchEnd([10, 11, 13], 11)).toEqual([10, 11])
    })
  })
})

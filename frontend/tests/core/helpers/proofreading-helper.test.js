import { describe, it, expect } from 'vitest'
import { proofreadingHelper } from '@/core/helpers/proofreading-helper.js'

const naiveDistance = (a, b) => {
  const rows = Array.from({ length: b.length + 1 }, (_, index) => index)

  for (let i = 0; i < a.length; i++) {
    let previous = rows[0]
    rows[0] = i + 1

    for (let j = 0; j < b.length; j++) {
      const current = rows[j + 1]
      rows[j + 1] = Math.min(rows[j + 1] + 1, rows[j] + 1, previous + (a[i] === b[j] ? 0 : 1))
      previous = current
    }
  }

  return rows[b.length]
}

const VOCABULARY = ['le', 'chat', 'dort', 'sur', 'un', 'toit', 'chaud', 'et', 'gris']

const seeded = seed => () => {
  seed = (seed * 1_103_515_245 + 12_345) % 2_147_483_648
  return seed / 2_147_483_648
}

describe('proofreading-helper', () => {
  describe('countWords', () => {
    it('ignores repeated spaces and edge whitespace', () => {
      expect(proofreadingHelper.countWords('  le   chat \n dort  ')).toBe(3)
    })

    it('counts nothing in an empty text', () => {
      expect(proofreadingHelper.countWords('   ')).toBe(0)
    })
  })

  describe('allowanceFor', () => {
    it('grants the floor to a short text, where a percentage would give nothing', () => {
      expect(proofreadingHelper.allowanceFor('le chat dort sur un toit')).toBe(5)
    })

    it('lets the percentage take over on a long text', () => {
      expect(proofreadingHelper.allowanceFor(Array(2000).fill('mot').join(' '))).toBe(20)
    })
  })

  describe('changedWords', () => {
    it('sees no change when only the case differs', () => {
      expect(proofreadingHelper.changedWords('Le Chat Dort', 'le chat dort', 5)).toBe(0)
    })

    it('counts one substitution', () => {
      expect(proofreadingHelper.changedWords('le chat dort', 'le chien dort', 5)).toBe(1)
    })

    it('counts an insertion and a deletion', () => {
      expect(proofreadingHelper.changedWords('le chat dort', 'le gros chat dort', 5)).toBe(1)
      expect(proofreadingHelper.changedWords('le chat dort', 'le dort', 5)).toBe(1)
    })

    it('stops counting once the allowance is passed', () => {
      const published = 'le chat dort sur un toit'
      const corrected = 'rien de tout cela ici bas'

      expect(proofreadingHelper.changedWords(published, corrected, 2)).toBe(3)
    })

    it('sees changes sitting at both ends of the text', () => {
      const published = 'le chat dort sur un toit chaud'
      const corrected = 'un chat dort sur un toit gris'

      expect(proofreadingHelper.changedWords(published, corrected, 5)).toBe(2)
    })

    it('matches a naive edit distance on random corrections', () => {
      const random = seeded(20_260_819)
      const pick = bound => Math.floor(random() * bound)
      let checked = 0

      for (let round = 0; round < 600; round++) {
        const published = Array.from({ length: pick(13) }, () => VOCABULARY[pick(9)])
        const corrected = [...published]

        for (let edit = 0; edit < pick(7); edit++) {
          const action = pick(3)
          if (action === 0 && corrected.length > 0) {
            corrected.splice(pick(corrected.length), 1)
            continue
          }
          if (action === 1) {
            corrected.splice(pick(corrected.length + 1), 0, VOCABULARY[pick(9)])
            continue
          }
          if (corrected.length > 0) {
            corrected[pick(corrected.length)] = VOCABULARY[pick(9)]
          }
        }

        for (const allowance of [0, 1, 2, 3, 5, 8]) {
          const expected = naiveDistance(published, corrected) > allowance
          const actual =
            proofreadingHelper.changedWords(published.join(' '), corrected.join(' '), allowance) >
            allowance

          expect(actual).toBe(expected)
          checked++
        }
      }

      expect(checked).toBe(3600)
    })
  })
})

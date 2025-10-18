import { utilsH } from '@brugmann/vuemann/src/helpers/utils-helper.js'
import { describe, it, expect } from 'vitest'

describe('getGenreIconClass', () => {
    it('should return empty string if genre is falsy', () => {
        expect(utilsH.getGenreIconClass(undefined)).toBe('')
        expect(utilsH.getGenreIconClass(null)).toBe('')
        expect(utilsH.getGenreIconClass('')).toBe('')
    })

    it('should return correct class for female ("f" or "F")', () => {
        expect(utilsH.getGenreIconClass('f')).toBe('fa-solid fa-venus')
        expect(utilsH.getGenreIconClass('F')).toBe('fa-solid fa-venus')
    })

    it('should return correct class for male ("m" or "M")', () => {
        expect(utilsH.getGenreIconClass('m')).toBe('fa-solid fa-mars')
        expect(utilsH.getGenreIconClass('M')).toBe('fa-solid fa-mars')
    })

    it('should return "fa-solid fa-neuter" for unknown genres', () => {
        expect(utilsH.getGenreIconClass('other')).toBe('fa-solid fa-neuter')
        expect(utilsH.getGenreIconClass('x')).toBe('fa-solid fa-neuter')
        expect(utilsH.getGenreIconClass('Z')).toBe('fa-solid fa-neuter')
    })
})

describe('utilsH.isRecursivelyIncluded', () => {
  it('should return true if subset matches exactly the object', () => {
    const subset = { a: 1 }
    const object = { a: 1, b: 2 }
    expect(utilsH.isRecursivelyIncluded(subset, object)).toBe(true)
  })

  it('should return true for deeply nested subset', () => {
    const subset = { a: { b: { c: 3 } } }
    const object = { a: { b: { c: 3, d: 4 }, e: 5 } }
    expect(utilsH.isRecursivelyIncluded(subset, object)).toBe(true)
  })

  it('should return false if subset is not included', () => {
    const subset = { a: { b: 99 } }
    const object = { a: { b: 3 } }
    expect(utilsH.isRecursivelyIncluded(subset, object)).toBe(false)
  })

  it('should handle non-object types correctly', () => {
    expect(utilsH.isRecursivelyIncluded(5, 5)).toBe(true)
    expect(utilsH.isRecursivelyIncluded(5, 10)).toBe(false)
  })
})

describe('utilsH.copyObject', () => {
  it('should deeply clone simple objects', () => {
    const obj = { a: 1, b: { c: 2 } }
    const cloned = utilsH.copyObject(obj)

    expect(cloned).toEqual(obj)
    expect(cloned).not.toBe(obj) // ensure it's not the same reference
    expect(cloned.b).not.toBe(obj.b) // ensure deep clone
  })
})

describe('utilsH.percentOf', () => {
  it('should calculate correct percentage', () => {
    expect(utilsH.percentOf(50, 200)).toBe(25)
    expect(utilsH.percentOf(0, 100)).toBe(0)
    expect(utilsH.percentOf(30, 60)).toBe(50)
  })

  it('should handle division by zero gracefully (returns Infinity)', () => {
    expect(utilsH.percentOf(5, 0)).toBe(Infinity)
  })

  it('should handle negative numbers', () => {
    expect(utilsH.percentOf(-10, 100)).toBe(-10)
  })
})

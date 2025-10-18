import { describe, it, expect } from 'vitest'
import { localViteFunction } from '@brugmann/vuemann/src/services/locale/locale-vite.js'

describe('mergeTranslations', () => {
  it('should merge simple key-value pairs', () => {
    const target = {}
    const source1 = { 'key1': 'value1', 'key2': 'value2' }
    const source2 = { 'key3': 'value3', 'key4': 'value4' }

    localViteFunction.mergeTranslations(source1, target)
    localViteFunction.mergeTranslations(source2, target)

    expect(target).toEqual({
      key1: 'value1',
      key2: 'value2',
      key3: 'value3',
      key4: 'value4'
    })
  })

  it('should merge nested objects correctly', () => {
    const target = {}
    const source1 = { 
      'level1': { 
        'key1': 'value1',
        'key2': 'value2'
      }
    }
    const source2 = { 
      'level1': { 
        'key3': 'value3',
        'key4': 'value4'
      },
      'level2': {
        'key5': 'value5'
      }
    }

    localViteFunction.mergeTranslations(source1, target)
    localViteFunction.mergeTranslations(source2, target)

    expect(target.level1).toEqual({
      key1: 'value1',
      key2: 'value2',
      key3: 'value3',
      key4: 'value4'
    })
    expect(target.level2).toEqual({
      key5: 'value5'
    })
  })

  it('should handle deep nested objects', () => {
    const target = {}
    const source1 = { 
      'deep': { 
        'level1': { 
          'key1': 'value1'
        }
      }
    }
    const source2 = { 
      'deep': { 
        'level1': { 
          'key2': 'value2'
        },
        'level2': {
          'key3': 'value3'
        }
      }
    }

    localViteFunction.mergeTranslations(source1, target)
    localViteFunction.mergeTranslations(source2, target)

    expect(target.deep.level1).toEqual({
      key1: 'value1',
      key2: 'value2'
    })
    expect(target.deep.level2).toEqual({
      key3: 'value3'
    })
  })

  it('should overwrite primitive values when keys conflict', () => {
    const target = {}
    const source1 = { 'key1': 'value1', 'key2': 'value2' }
    const source2 = { 'key1': 'new_value1', 'key3': 'value3' }

    localViteFunction.mergeTranslations(source1, target)
    localViteFunction.mergeTranslations(source2, target)

    expect(target.key1).toBe('new_value1')
    expect(target.key2).toBe('value2')
    expect(target.key3).toBe('value3')
  })

  it('should handle mixed data types', () => {
    const target = {
      string: 'hello',
      number: 42,
      boolean: true,
      object: { nested: 'value' },
      array: [1, 2, 3]
    }
    const source2 = {
      string: 'world',
      object: { another: 'value' },
      array: [4, 5, 6]
    }

    localViteFunction.mergeTranslations(source2, target)

    expect(target.string).toBe('world')
    expect(target.number).toBe(42)
    expect(target.boolean).toBe(true)
    expect(target.object).toEqual({ nested: 'value', another: 'value' })
    expect(target.array).toEqual([4, 5, 6])
  })
})

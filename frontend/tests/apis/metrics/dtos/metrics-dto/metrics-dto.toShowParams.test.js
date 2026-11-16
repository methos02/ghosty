import { describe, it, expect } from 'vitest'
import { MetricsDto } from '@/apis/metrics/dtos/metrics-dto.js'

describe('metrics-dto', () => {
  describe('toShowParams', () => {
    it('asks the period in days', () => {
      expect(MetricsDto.toShowParams(90)).toEqual({ days: 90 })
    })
  })
})

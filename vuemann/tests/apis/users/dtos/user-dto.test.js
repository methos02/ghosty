import { describe, it, expect, beforeEach } from 'vitest'
import { userDto } from '@brugmann/vuemann/src/apis/users/dtos/user-dto.js'
import { getUser } from '&/utils/seeders/users-seeder.js'
import { getGroups } from '&/utils/seeders/groups-seeder.js'
import { getLevels } from '&/utils/seeders/levels-seeder.js'

describe('user-dto', () => {
  let realUser
  let realUserWithGroups

  beforeEach(() => {
    realUser = getUser()
    
    const realLevels = getLevels()
    const realGroups = getGroups(2, { 
      levels: [realLevels[0], realLevels[1]]
    })
    
    realUserWithGroups = getUser({
      groups: [
        {
          group: {
            ...realGroups[0],
            level: realGroups[0].levels
          }
        },
        {
          group: {
            ...realGroups[1],
            level: []
          }
        }
      ]
    })
  })

  describe('basic transformation without groups', () => {
    it('should correctly map all basic fields from seeder data', () => {
      const result = userDto(realUser, false)

      expect(result.id).toBe(realUser.id)
      expect(result.username).toBe(realUser.username)
      expect(result.lastname).toBe(realUser.lastname)
      expect(result.firstname).toBe(realUser.firstname)
      expect(result.email).toBe(realUser.email)
      
      expect(result.fullname).toBe(realUser.lastname.toUpperCase() + ' ' + realUser.firstname.charAt(0).toUpperCase() + realUser.firstname.slice(1).toLowerCase())
      
      expect(result.groups).toBeUndefined()
    })
  })

  describe('transformation with groups', () => {
    it('should correctly map user with groups when groups flag is true', () => {
      const result = userDto(realUserWithGroups, true)

      expect(result.id).toBe(realUserWithGroups.id)
      expect(result.username).toBe(realUserWithGroups.username)
      expect(result.lastname).toBe(realUserWithGroups.lastname)
      expect(result.firstname).toBe(realUserWithGroups.firstname)
      expect(result.email).toBe(realUserWithGroups.email)
      expect(result.fullname).toBeDefined()

      expect(result.groups).toBeDefined()
      expect(result.groups).toHaveLength(2)
      
      const realLevels = getLevels()
      const expectedGroups = getGroups(2, { 
        levels: [realLevels[0], realLevels[1]]
      })
      
      expect(result.groups[0]).toEqual({
        id: expectedGroups[0].id,
        name: expectedGroups[0].name,
        description: expectedGroups[0].description,
        levels: expectedGroups[0].levels
      })

      expect(result.groups[1]).toEqual({
        id: expectedGroups[1].id,
        name: expectedGroups[1].name,
        description: expectedGroups[1].description,
        levels: []
      })
    })

    it('should handle user without groups when groups flag is true', () => {
      const result = userDto(realUser, true)

      expect(result.groups).toEqual([])
    })

    it('should map group levels correctly when present', () => {
      const realLevels = getLevels()
      const testGroup = getGroups(1, { 
        levels: [realLevels[1], realLevels[2]]
      })[0]
      
      const userWithLevels = getUser({
        groups: [
          {
            group: {
              ...testGroup,
              level: testGroup.levels
            }
          }
        ]
      })

      const result = userDto(userWithLevels, true)

      expect(result.groups[0].levels).toEqual(testGroup.levels)
      expect(result.groups[0].levels).toHaveLength(2)
      expect(result.groups[0].levels[0]).toHaveProperty('level')
      expect(result.groups[0].levels[0]).toHaveProperty('name')
    })

    it('should handle groups with missing level property', () => {
      const groupWithoutLevels = getGroups(1)[0]
      
      const userWithMissingLevels = getUser({
        groups: [
          {
            group: {
              ...groupWithoutLevels
            }
          }
        ]
      })

      const result = userDto(userWithMissingLevels, true)

      expect(result.groups[0].levels).toEqual([])
      expect(result.groups[0].id).toBe(groupWithoutLevels.id)
      expect(result.groups[0].name).toBe(groupWithoutLevels.name)
    })
  })
}) 

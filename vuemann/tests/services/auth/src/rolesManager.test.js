import { describe, test, expect, beforeEach, vi } from 'vitest'
import { rolesManager } from '@brugmann/vuemann/src/services/auth/src/models/roles-manager.js'

describe('rolesManager', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('hasRoleAccess', () => {
    test('devrait retourner true si l\'utilisateur a le groupe et le niveau requis', () => {
      const userGroups = [
        {
          id: 1908,
          name: "RdvManager",
          level: 10
        }
      ]

      const roleRequirements = [
        {
          group: "RdvManager",
          level: 5
        }
      ]

      const result = rolesManager.hasRoleAccess(userGroups, roleRequirements)
      expect(result).toBe(true)
    })

    test('devrait retourner false si l\'utilisateur n\'a pas le groupe requis', () => {
      const userGroups = [
        {
          id: 1908,
          name: "OtherGroup",
          level: 10
        }
      ]

      const roleRequirements = [
        {
          group: "RdvManager",
          level: 5
        }
      ]

      const result = rolesManager.hasRoleAccess(userGroups, roleRequirements)
      expect(result).toBe(false)
    })

    test('devrait retourner false si l\'utilisateur a le groupe mais pas le niveau requis', () => {

      const userGroups = [
        {
          id: 1908,
          name: "RdvManager",
          level: 3
        }
      ]

      const roleRequirements = [
        {
          group: "RdvManager",
          level: 5
        }
      ]

      const result = rolesManager.hasRoleAccess(userGroups, roleRequirements)
      expect(result).toBe(false)
    })

    test('devrait retourner true si au moins une exigence est satisfaite (rôle multiple)', () => {
      const userGroups = [
        {
          id: 1908,
          name: "RdvManager",
          level: 5
        },
        {
          id: 1909,
          name: "SystemAdmin",
          level: 15
        }
      ]

      const roleRequirements = [
        {
          group: "RdvManager",
          level: 5
        },
        {
          group: "SystemAdmin",
          level: 10
        }
      ]

      const result = rolesManager.hasRoleAccess(userGroups, roleRequirements)
      expect(result).toBe(true)
    })
  })
}) 

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { UserController } from '@brugmann/vuemann/src/apis/users/controllers/user-controller.js'
import { UserRepository } from '@brugmann/vuemann/src/apis/users/repositories/user-repository.js'
import { STATUS } from '@brugmann/vuemann/src/services/ajax/ajax-constants.js'
import { getUsers, getUser } from '&/utils/seeders/users-seeder.js'

describe('user-controller', () => {
  // ✅ Constantes pour éviter la répétition
  const DEFAULT_SEARCH_OPTIONS = {
    substring: 'test',
    skip: 0,
    limit: 20
  }

  const DEFAULT_PAGINATOR = {
    skip: 0,
    limit: 20,
    total: 25
  }

  let testData

  beforeEach(() => {
    vi.clearAllMocks()
    
    // ✅ Données de test centralisées
    testData = {
      users: getUsers(3),
      userWithGroups: getUser({
        groups: [
          {
            group: {
              id: 1,
              name: 'Administrateurs',
              description: 'Groupe administrateur',
              level: [{ id: 1, name: 'Level 1' }]
            }
          }
        ]
      })
    }
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  // ✅ Helpers simples et explicites
  const createSuccessResponse = (items, paginator) => ({
    status: STATUS.SUCCESS,
    data: { items, ...paginator }
  })

  const createErrorResponse = (status, error) => ({
    status,
    error
  })

  describe('userSearch', () => {
    describe('successful responses', () => {
      it('should transform users through real DTO logic on successful lastname search', async () => {
        const searchOptions = { ...DEFAULT_SEARCH_OPTIONS, substring: 'user1', typeSearch: 'fullname' }

        vi.spyOn(UserRepository, 'userSearchLastname').mockResolvedValueOnce(
          createSuccessResponse(testData.users, DEFAULT_PAGINATOR)
        )

        const result = await UserController.userSearch('user1', searchOptions)

        expect(UserRepository.userSearchLastname).toHaveBeenCalledWith({
          substring: 'user1',
          skip: 0,
          limit: 20
        })
        
        expect(result.users).toHaveLength(3)
        expect(result.paginator).toEqual(DEFAULT_PAGINATOR)
        expect(result.users[0]).toHaveProperty('fullname')
        expect(result.users[0].id).toBe(testData.users[0].id)
      })

      it('should transform users through real DTO logic on successful username search', async () => {
        const searchOptions = { substring: 'USER1', skip: 10, limit: 15, typeSearch: 'username' }
        const expectedPaginator = { skip: 10, limit: 15, total: 1 }

        vi.spyOn(UserRepository, 'userSearch').mockResolvedValueOnce(
          createSuccessResponse([testData.users[0]], expectedPaginator)
        )

        const result = await UserController.userSearch('USER1', searchOptions)

        expect(UserRepository.userSearch).toHaveBeenCalledWith({ 
          substring: 'USER1', 
          skip: 10, 
          limit: 15 
        })
        
        expect(result.users).toHaveLength(1)
        expect(result.paginator).toEqual(expectedPaginator)
      })

      it('should pass groups parameter correctly to DTO when groups option is true', async () => {
        const searchOptions = { ...DEFAULT_SEARCH_OPTIONS, substring: 'admin', limit: 10, groups: true }
        const expectedPaginator = { skip: 0, limit: 10, total: 1 }

        vi.spyOn(UserRepository, 'userSearchLastname').mockResolvedValueOnce(
          createSuccessResponse([testData.userWithGroups], expectedPaginator)
        )

        const result = await UserController.userSearch('admin', searchOptions)

        expect(result.users[0]).toHaveProperty('groups')
        expect(Array.isArray(result.users[0].groups)).toBe(true)
      })

      it('should default groups parameter to false when not provided', async () => {
        const searchOptions = { ...DEFAULT_SEARCH_OPTIONS, limit: 10 }
        const expectedPaginator = { skip: 0, limit: 10, total: 3 }

        vi.spyOn(UserRepository, 'userSearchLastname').mockResolvedValueOnce(
          createSuccessResponse(testData.users, expectedPaginator)
        )

        const result = await UserController.userSearch('test', searchOptions)

        expect(result.users[0]).not.toHaveProperty('groups')
      })

      it('should remove items property from response data before returning paginator', async () => {
        const searchOptions = { ...DEFAULT_SEARCH_OPTIONS, limit: 10 }
        const customPaginator = { skip: 0, limit: 10, total: 3, someOtherProperty: 'should remain' }

        vi.spyOn(UserRepository, 'userSearchLastname').mockResolvedValueOnce(
          createSuccessResponse(testData.users, customPaginator)
        )

        const result = await UserController.userSearch('test', searchOptions)

        expect(result.paginator).toEqual(customPaginator)
        expect(result.paginator).not.toHaveProperty('items')
      })
    })

    describe('error responses', () => {
      it('should return empty users array on repository error without DTO transformation', async () => {
        vi.spyOn(UserRepository, 'userSearchLastname').mockResolvedValueOnce(
          createErrorResponse(STATUS.ERROR_SERVER, 'Repository error')
        )

        const result = await UserController.userSearch('test', DEFAULT_SEARCH_OPTIONS)
        
        expect(result).toEqual({ users: [] })
      })

      it('should return empty users array on username search error', async () => {
        vi.spyOn(UserRepository, 'userSearch').mockResolvedValueOnce(
          createErrorResponse(STATUS.ERROR_CLIENT, 'Invalid request')
        )

        const result = await UserController.userSearch('test', { 
          ...DEFAULT_SEARCH_OPTIONS,
          typeSearch: 'username' 
        })
        
        expect(result).toEqual({ users: [] })
      })

      it('should handle repository rejection gracefully', async () => {
        vi.spyOn(UserRepository, 'userSearchLastname').mockRejectedValueOnce(
          new Error('Network error')
        )

        await expect(
          UserController.userSearch('test', DEFAULT_SEARCH_OPTIONS)
        ).rejects.toThrow('Network error')
      })
    })

    describe('search type routing', () => {
      const emptyPaginator = { skip: 0, limit: 10, total: 0 }

      it('should call userSearch repository when typeSearch is username', async () => {
        vi.spyOn(UserRepository, 'userSearch').mockResolvedValueOnce(
          createSuccessResponse([], emptyPaginator)
        )
        vi.spyOn(UserRepository, 'userSearchLastname')

        await UserController.userSearch('USER1', { 
          ...DEFAULT_SEARCH_OPTIONS, 
          substring: 'USER1', 
          typeSearch: 'username' 
        })

        expect(UserRepository.userSearch).toHaveBeenCalled()
        expect(UserRepository.userSearchLastname).not.toHaveBeenCalled()
      })

      it('should call userSearchLastname repository when typeSearch is not username', async () => {
        vi.spyOn(UserRepository, 'userSearch')
        vi.spyOn(UserRepository, 'userSearchLastname').mockResolvedValueOnce(
          createSuccessResponse([], emptyPaginator)
        )

        await UserController.userSearch('Dupont', { 
          ...DEFAULT_SEARCH_OPTIONS,
          substring: 'Dupont', 
          typeSearch: 'fullname' 
        })

        expect(UserRepository.userSearchLastname).toHaveBeenCalled()
        expect(UserRepository.userSearch).not.toHaveBeenCalled()
      })

      it('should default to lastname search when typeSearch is undefined', async () => {
        vi.spyOn(UserRepository, 'userSearch')
        vi.spyOn(UserRepository, 'userSearchLastname').mockResolvedValueOnce(
          createSuccessResponse([], emptyPaginator)
        )

        await UserController.userSearch('Dupont', { 
          ...DEFAULT_SEARCH_OPTIONS,
          substring: 'Dupont' 
        })

        expect(UserRepository.userSearchLastname).toHaveBeenCalled()
        expect(UserRepository.userSearch).not.toHaveBeenCalled()
      })

      it('should detect bug if typeSearch is incorrectly named type', async () => {
        vi.spyOn(UserRepository, 'userSearch')
        vi.spyOn(UserRepository, 'userSearchLastname').mockResolvedValueOnce(
          createSuccessResponse([], emptyPaginator)
        )

        await UserController.userSearch('USER1', { 
          ...DEFAULT_SEARCH_OPTIONS, 
          substring: 'USER1', 
          type: 'username' 
        })

        expect(UserRepository.userSearch).not.toHaveBeenCalled()
        expect(UserRepository.userSearchLastname).toHaveBeenCalled()
      })
    })

    describe('edge cases and data integrity', () => {
      it('should handle empty repository response correctly', async () => {
        const emptyPaginator = { skip: 0, limit: 10, total: 0 }
        
        vi.spyOn(UserRepository, 'userSearchLastname').mockResolvedValueOnce(
          createSuccessResponse([], emptyPaginator)
        )

        const result = await UserController.userSearch('nonexistent', { 
          ...DEFAULT_SEARCH_OPTIONS,
          substring: 'nonexistent',
          limit: 10
        })

        expect(result.users).toEqual([])
        expect(result.paginator).toEqual(emptyPaginator)
      })

      it('should preserve main search parameters in repository call', async () => {
        const searchOptions = { substring: 'complex search', skip: 25, limit: 50, groups: true }
        const expectedPaginator = { skip: 25, limit: 50, total: 0 }

        vi.spyOn(UserRepository, 'userSearchLastname').mockResolvedValueOnce(
          createSuccessResponse([], expectedPaginator)
        )

        await UserController.userSearch('complex search', searchOptions)

        expect(UserRepository.userSearchLastname).toHaveBeenCalledWith({
          substring: 'complex search',
          skip: 25,
          limit: 50
        })
      })

      it('should work with large datasets', async () => {
        const largeUserSet = getUsers(100)
        const largePaginator = { skip: 0, limit: 100, total: 100 }
        
        vi.spyOn(UserRepository, 'userSearchLastname').mockResolvedValueOnce(
          createSuccessResponse(largeUserSet, largePaginator)
        )

        const result = await UserController.userSearch('test', { 
          ...DEFAULT_SEARCH_OPTIONS,
          limit: 100 
        })

        expect(result.users).toHaveLength(100)
        expect(result.paginator.total).toBe(100)
        expect(result.users[0]).toHaveProperty('fullname')
        expect(result.users[99]).toHaveProperty('fullname')
      })
    })
  })
}) 

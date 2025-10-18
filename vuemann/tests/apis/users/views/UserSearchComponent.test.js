import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { setActivePinia, createPinia } from 'pinia'
import { getUsers, getUser } from '&/utils/seeders/users-seeder.js'
import { STATUS } from '@brugmann/vuemann/src/services/ajax/ajax-constants.js'
import { UserRepository } from '@brugmann/vuemann/src/apis/users/repositories/user-repository.js'
import { triggerInput } from '&/utils/functions/utils.js'
import UserSearchComponent from '@brugmann/vuemann/src/apis/users/views/UserSearchComponent.vue'
import { userDto } from '@brugmann/vuemann/src/apis/users/dtos/user-dto.js'

describe('UserSearchComponent', () => {
  let wrapper, rawUsers, usersCount, usersTotal, usersLimit, usersSkip

  const createWrapper = (props = {}) => {
    const defaultProps = { modelValue: [], groups: false }
    
    wrapper = mount(UserSearchComponent, {
      props: { ...defaultProps, ...props }
    })
    
    return wrapper
  }

  beforeEach(() => {
    setActivePinia(createPinia())
    vi.useFakeTimers()
    vi.clearAllMocks()

    usersCount = 3
    usersTotal = 25
    usersLimit = 20
    usersSkip = 0
    rawUsers = getUsers(usersCount)

    vi.spyOn(UserRepository, 'userSearchLastname').mockResolvedValue({
      status: STATUS.SUCCESS,
      data: { items: rawUsers, skip: usersSkip, limit: usersLimit, total: usersTotal }
    })
    
    vi.spyOn(UserRepository, 'userSearch').mockResolvedValue({
      status: STATUS.SUCCESS,
      data: { items: rawUsers, skip: usersSkip, limit: usersLimit, total: usersTotal }
    })
  })

  afterEach(() => {
    wrapper?.unmount()
    vi.resetAllMocks()
    vi.useRealTimers()
  })

  describe('initial rendering', () => {
    it('should render search input with correct initial state', () => {
      createWrapper()
      const switchButton = wrapper.find('#user_search_switch')
      
      expect(switchButton.exists()).toBe(true)
      expect(switchButton.find('i.fa-solid.fa-repeat').exists()).toBe(true)      
      expect(wrapper.find('#user_search_switch').exists()).toBe(true)
      expect(wrapper.findComponent({ name: 'InputSearchComponent' }).exists()).toBe(true)
      expect(wrapper.findComponent({ name: 'ErrorFormComponent' }).exists()).toBe(true)
      expect(wrapper.vm.typeSearch).toBe('fullname')
      expect(wrapper.vm.usersPaginator).toEqual({ skip: usersSkip, limit: usersLimit })
      expect(wrapper.find('[data-users]').exists()).toBe(false)
    })

    it('should render with groups prop correctly', () => {
      createWrapper({ groups: true })

      expect(wrapper.vm.groups).toBe(true)
    })
  })

  describe('search functionality', () => {
    it('should search users via triggerInput and update state correctly', async () => {
        createWrapper()

        expect(wrapper.vm.users).toEqual([])

        await triggerInput(wrapper, 'input[type="search"]', 'test')

        expect(wrapper.vm.search).toBe('test')
        expect(wrapper.vm.users).toHaveLength(usersCount)
        expect(wrapper.vm.users[0]).toStrictEqual(userDto(rawUsers[0]))
        expect(wrapper.vm.usersPaginator).toEqual({ skip: usersSkip, limit: usersLimit, total: usersTotal })
    })

    it('should append users when skip is not 0', async () => {
      createWrapper()
      const existingUser = userDto({...getUser(), lastname: 'existing'})
      wrapper.vm.users = [existingUser]
      wrapper.vm.usersPaginator = { skip: 20, limit: 20 }

      await triggerInput(wrapper, 'input[type="search"]', 'test')

      expect(wrapper.vm.users).toHaveLength(usersCount + 1)
      expect(wrapper.vm.users[0]).toStrictEqual(existingUser)
      expect(wrapper.vm.users[1]).toStrictEqual(userDto(rawUsers[0]))
    })

    it('should handle repository error gracefully with triggerInput', async () => {
      UserRepository.userSearchLastname.mockResolvedValueOnce({
        status: 'ERROR_SERVER',
        error: 'Repository error'
      })
      
      createWrapper()

      await triggerInput(wrapper, 'input[type="search"]', 'test')

      expect(wrapper.vm.users).toEqual([])
    })

    it('should pass correct options to custom callback', async () => {
      const mockCallback = vi.fn().mockResolvedValue({
        users: [{ id: 1, fullname: 'Test User', username: 'test' }],
        paginator: { skip: 0, limit: 20, total: 1 }
      })
      
      createWrapper({ callback: mockCallback })
      
      await triggerInput(wrapper, 'input[type="search"]', 'test')
      expect(mockCallback).toHaveBeenCalledWith('test', expect.objectContaining({
        typeSearch: 'fullname', skip: 0, limit: 20, groups: false 
      }))
      
      const switchButton = wrapper.find('#user_search_switch')
      await switchButton.trigger('click')
      
      mockCallback.mockClear()
      
      await triggerInput(wrapper, 'input[type="search"]', 'test')
      expect(mockCallback).toHaveBeenCalledWith('test', expect.objectContaining({
        typeSearch: 'username',
        skip: 0,
        limit: 20,
        groups: false
      }))
    })
  })

  describe('loadMoreUser function', () => {
    it('should load more users with correct pagination', async () => {
      createWrapper()
      
      wrapper.vm.search = 'test search'
      wrapper.vm.users = [userDto({...getUser(), lastname: 'load'})]

      await wrapper.vm.loadMoreUser(20, 20)

      expect(wrapper.vm.users).toHaveLength(usersCount + 1)
      expect(wrapper.vm.users[1]).toStrictEqual(userDto(rawUsers[0]))
    })
  })

  describe('exposed methods', () => {
    it('should expose toggleDropdown method', () => {
      createWrapper()

      expect(typeof wrapper.vm.toggleDropdown).toBe('function')
      
      expect(() => wrapper.vm.toggleDropdown(true)).not.toThrow()
      expect(() => wrapper.vm.toggleDropdown(false)).not.toThrow()
    })

    it('should expose setSearch method', () => {
      createWrapper()

      expect(typeof wrapper.vm.setSearch).toBe('function')
        
      expect(() => wrapper.vm.setSearch('test value')).not.toThrow()
      expect(() => wrapper.vm.setSearch('')).not.toThrow()
    })
  })

  describe('modelValue emission', () => {
    it('should emit update:modelValue when users change', async () => {
      createWrapper()

      const transformedUsers = [{ id: 1, fullname: 'TEST User', username: 'test1' }]
      wrapper.vm.users = transformedUsers
      await wrapper.vm.$nextTick()

      expect(wrapper.emitted('update:modelValue')).toBeTruthy()
      expect(wrapper.emitted('update:modelValue')[0]).toEqual([transformedUsers])
    })

    it('should emit multiple times as users are updated', async () => {
      createWrapper()

      const singleUser = [{ id: 1, fullname: 'Single User', username: 'single' }]
      const multipleUsers = [
        { id: 1, fullname: 'User 1', username: 'user1' },
        { id: 2, fullname: 'User 2', username: 'user2' }
      ]

      wrapper.vm.users = singleUser
      await wrapper.vm.$nextTick()

      wrapper.vm.users = multipleUsers
      await wrapper.vm.$nextTick()

      expect(wrapper.emitted('update:modelValue')).toHaveLength(2)
      expect(wrapper.emitted('update:modelValue')[0]).toEqual([singleUser])
      expect(wrapper.emitted('update:modelValue')[1]).toEqual([multipleUsers])
    })
  })

  describe('user interactions', () => {
    it('should change search type when switch button is clicked', async () => {
      createWrapper()

      expect(wrapper.vm.typeSearch).toBe('fullname')

      const switchButton = wrapper.find('#user_search_switch')
      await switchButton.trigger('click')

      expect(wrapper.vm.typeSearch).toBe('username')
      expect(wrapper.vm.search).toBe('')
      expect(wrapper.vm.users).toEqual([])

      await switchButton.trigger('click')
      expect(wrapper.vm.typeSearch).toBe('fullname')
    })

    it('should call correct repository method based on search type - fullname search', async () => {
      createWrapper()
      
      expect(wrapper.vm.typeSearch).toBe('fullname')
      
      await triggerInput(wrapper, 'input[type="search"]', 'test')
      
      expect(UserRepository.userSearchLastname).toHaveBeenCalledWith({ substring: 'test', skip: 0, limit: 20 })
      expect(UserRepository.userSearch).not.toHaveBeenCalled()
    })

    it('should call correct repository method based on search type - username search', async () => {
      createWrapper()
      
      const switchButton = wrapper.find('#user_search_switch')
      await switchButton.trigger('click')
      expect(wrapper.vm.typeSearch).toBe('username')
      
      await triggerInput(wrapper, 'input[type="search"]', 'test')
      
      expect(UserRepository.userSearch).toHaveBeenCalledWith({ substring: 'test', skip: 0, limit: 20 })
      expect(UserRepository.userSearchLastname).not.toHaveBeenCalled()
    })

    it('should pass correct typeSearch option to UserController', async () => {
      const UserController = await import('@brugmann/vuemann/src/apis/users/controllers/user-controller.js')
      const userSearchSpy = vi.spyOn(UserController.UserController, 'userSearch')
      
      createWrapper()
      
      await triggerInput(wrapper, 'input[type="search"]', 'test')
      expect(userSearchSpy).toHaveBeenCalledWith('test', expect.objectContaining({
        typeSearch: 'fullname'
      }))
      
      const switchButton = wrapper.find('#user_search_switch')
      await switchButton.trigger('click')
      
      userSearchSpy.mockClear()
      
      await triggerInput(wrapper, 'input[type="search"]', 'test')
      expect(userSearchSpy).toHaveBeenCalledWith('test', expect.objectContaining({
        typeSearch: 'username'
      }))
    })

    it('should reset pagination when switching search type', async () => {
      createWrapper()
      
      wrapper.vm.usersPaginator = { skip: 40, limit: 20, total: 100 }
      wrapper.vm.users = [{ id: 1, fullname: 'Test User' }]
      wrapper.vm.search = 'test'
      
      const switchButton = wrapper.find('#user_search_switch')
      await switchButton.trigger('click')
      
      expect(wrapper.vm.usersPaginator).toEqual({ skip: 0, limit: 20 })
      expect(wrapper.vm.users).toEqual([])
      expect(wrapper.vm.search).toBe('')
    })
  })

  describe('paginator integration', () => {
    it('should render paginator with correct props', async () => {
      createWrapper()

      await triggerInput(wrapper, 'input[type="search"]', 'test')

      const paginator = wrapper.findComponent({ name: 'PaginatorComponent' })
      
      expect(paginator.exists()).toBe(true)
      expect(paginator.props('type')).toBe('infinite')
      expect(paginator.props('params')).toEqual(wrapper.vm.usersPaginator)
      expect(paginator.props('cb')).toBe(wrapper.vm.loadMoreUser)
    })

    it('should display total users count in result section', async () => {
      createWrapper()

      await wrapper.vm.$nextTick()

      await triggerInput(wrapper, 'input[type="search"]', 'test')

      const totalText = wrapper.find('[data-total]')
      expect(totalText.text()).toContain(usersTotal)
    })
  })
}) 

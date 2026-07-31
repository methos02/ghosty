import { describe, it, expect } from 'vitest'
import { createAuthStore } from '@/services/auth/src/auth-store.js'
import { userSeeder } from '&/utils/seeders/user-seeder.js'

describe('auth-store', () => {
  it('isolates each instance so a request never leaks into another', () => {
    const firstStore = createAuthStore()
    const secondStore = createAuthStore()

    firstStore.setUser(userSeeder.getUser())

    expect(secondStore.isAuthenticated.value).toBe(false)
  })

  it('transfers the user from a serialized snapshot to another store', () => {
    const serverStore = createAuthStore()
    const clientStore = createAuthStore()
    const user = userSeeder.getUser()

    serverStore.setUser(user)
    clientStore.hydrate(serverStore.serialize())

    expect(clientStore.user.value).toEqual(user)
  })

  it('derives the role flags from the hydrated user', () => {
    const store = createAuthStore()

    store.setUser(userSeeder.getUser({ roles: ['author', 'moderator'] }))

    expect(store.isAuthor.value).toBe(true)
    expect(store.isModerator.value).toBe(true)
    expect(store.isAdmin.value).toBe(false)
  })
})

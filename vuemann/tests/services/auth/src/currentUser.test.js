import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { currentUser } from '@brugmann/vuemann/src/services/auth/src/models/current-user.js'
import { createPinia, setActivePinia } from "pinia";
import { authStore } from '@brugmann/vuemann/src/services/auth/auth-store.js';

describe('current-user.js', () => {
    const testUsername = 'JohnDoe'

    beforeEach(() => {
        setActivePinia(createPinia())
        localStorage.clear()
    })

    it('doit setter correctement un utilisateur', () => {
        currentUser.set(testUsername)
        expect(localStorage.getItem('current_user')).toBe(testUsername.toUpperCase())

        expect(authStore.get().currentUser).toBe(testUsername.toUpperCase())
        expect(currentUser.get()).toBe(testUsername.toUpperCase())

        currentUser.remove()
        expect(authStore.get().currentUser).toBeUndefined()
        expect(localStorage.getItem('current_user')).toBeNull()
    })

    it('doit retourner true si il y a un current_user dans le local storage', () => {
        expect(currentUser.has()).toBeFalsy()

        currentUser.set(testUsername)

        expect(currentUser.has()).toBeTruthy()
        currentUser.remove()
    })

    it('init', () => {
        expect(currentUser.init()).toBeFalsy()

        localStorage.setItem('current_user', testUsername)
        expect(currentUser.init()).toBeTruthy()
        expect(currentUser.get()).toBe(testUsername)
    
        currentUser.remove()
    })
})

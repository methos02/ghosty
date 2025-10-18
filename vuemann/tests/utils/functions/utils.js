import { createRouter, createWebHistory } from "vue-router";
import { ConfigLoader } from "@brugmann/vuemann/src/config/config-loader.js";
import { vi } from 'vitest'
import { flushPromises } from '@vue/test-utils'

export const initRouter = () => {
    return createRouter({
        history: createWebHistory(),
        routes: ConfigLoader.get('routes')
    })
}

const TIME = 1000
export const triggerInput = async (wrapper, selector, value = 'test') => {
    const userSearch = wrapper.find(`${selector}`)

    await userSearch.setValue(value)
    await userSearch.trigger('input')
    await vi.advanceTimersByTimeAsync(TIME)
}

export const triggerConfirm = async (wrapper, type) => {
    const confirm = wrapper.findComponent({ name: type === 'icon' ? 'ConfirmIconComponent' : 'ConfirmButtonComponent' })

    confirm.find(type === 'icon' ? '[data-confirm]' : '[data-confirm] button').trigger('click')
    await flushPromises()

    confirm.find('[data-valide]').trigger('click')
    await flushPromises()
}



export const triggerLoader = async (wrapper) => {
    const loader = wrapper.findComponent({ name: 'LoaderComponent' })
    
    loader.find('button').trigger('click')
    await flushPromises()
}

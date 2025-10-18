import { wsQueue } from '@brugmann/vuemann/src/services/websocket/src/models/ws-queue.js'
import { describe, it, vi, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'

beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
})

const deferedPromise = () => {
    let resolve, reject
    const promise = new Promise((res, rej) => {
        resolve = res
        reject = rej
    })
    return { promise, resolve, reject }
}

describe('processMessages', () => {
    it('should process messages', async () => {
        const calls = []
        const messages = [
            { route_name: 'route1', message: { data: '{"event": "testEvent1"}' } },
            { route_name: 'route2', message: { data: '{"event": "testEvent2"}' } }
        ]

        //créer un mock ou le premier appel est bloqué mais pas le second
        const firstDeferred = deferedPromise()
        vi.spyOn(wsQueue, 'processMessage').mockImplementation((route_name, message) => {
            if (calls.length === 0) {
                calls.push({ route_name, message, deferred: firstDeferred })
                return firstDeferred.promise
            }

            calls.push({ route_name, message })
            return Promise.resolve(true)
        })

        //execution des messages
        const resultBlocked = wsQueue.wsOnMessage( messages[0].route_name, messages[0].message)
        await wsQueue.wsOnMessage( messages[1].route_name, messages[1].message)

        expect(wsQueue.processMessage).toHaveBeenCalledExactlyOnceWith(messages[0].route_name, messages[0].message)
        expect(calls[0].route_name).toBe(messages[0].route_name)
        expect(wsQueue.getMessages()).toHaveLength(1)
        expect(wsQueue.getMessages()[0]).toMatchObject(messages[1])
   
        //on débloque le premier appel
        calls[0].deferred.resolve(true)
        await resultBlocked

        expect(wsQueue.processMessage).toHaveBeenCalledTimes(2)
        expect(calls[1].route_name).toBe(messages[1].route_name)
        expect(wsQueue.getMessages()).toHaveLength(0)
    })
})

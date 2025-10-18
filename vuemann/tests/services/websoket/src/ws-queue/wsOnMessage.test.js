import { wsQueue } from '@brugmann/vuemann/src/services/websocket/src/models/ws-queue.js'
import { describe, it, vi, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'

beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
})

describe('wsOnMessage', () => {
    it('should push messages to the queue and process them', async () => {
        const messages = [
            { route_name: 'route1', message: { data: '{"event": "testEvent1"}' } },
            { route_name: 'route2', message: { data: '{"event": "testEvent2"}' } }
        ]

        vi.spyOn(wsQueue, 'processMessages').mockResolvedValue(true)

        await wsQueue.wsOnMessage(messages[0].route_name, messages[0].message)
        await wsQueue.wsOnMessage(messages[1].route_name, messages[1].message)

        expect(wsQueue.processMessages).toHaveBeenCalledTimes(1)
        expect(wsQueue.getMessages().length).toEqual(2)
    })
})
       

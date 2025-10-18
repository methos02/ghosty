import { describe, it, expect, vi, beforeEach, afterEach, beforeAll } from 'vitest';
import { websocketService } from '@brugmann/vuemann/src/services/websocket/init/websocket-service.js';
import {createPinia, setActivePinia} from "pinia";
import { flashService } from '@brugmann/vuemann/src/services/flash/init/flash-service.js';
import { t } from '@brugmann/vuemann/src/services/services-helper.js';
import { WebsocketMock } from '&/utils/mocks/websocket-mock.js';
import { websocketFunctionsInternal } from '@brugmann/vuemann/src/services/websocket/src/websocket-functions.js';
import { Socket } from '@brugmann/vuemann/src/services/websocket/src/models/socket.js';
import { EventWs } from '@brugmann/vuemann/src/services/websocket/src/models/event-ws.js';

describe('websocketService', () => {
    beforeEach(() => {
        setActivePinia(createPinia())
        vi.stubGlobal('WebSocket', WebsocketMock)
        vi.spyOn(console, 'log').mockReturnValue(false);
    });

    afterEach(() => {
        vi.restoreAllMocks()
        vi.unstubAllGlobals()
    });

    it("l'event est déjà enregistré", () => {
        vi.spyOn(flashService, 'error').mockReturnValue(false)
        
        websocketService.open('wsRoute')
        websocketService.register('wsRoute', 'testEvent', vi.fn())

        const res = websocketService.register('wsRoute', 'testEvent', vi.fn())

        expect(res).toBe(false)
        expect(flashService.error).toHaveBeenCalledExactlyOnceWith(t('ws_event_already_exist'))

        websocketService.close('wsRoute')
    });

    it("si l'init de la connxion ws échoue", () => {
        vi.spyOn(flashService, 'error').mockReturnValue(false)
        vi.spyOn(websocketFunctionsInternal, 'getRouteFromConfig').mockReturnValue('ws_route_unknow')
        
        const res = websocketService.register('wsRoute', 'testEvent', vi.fn());

        expect(res).toBe(false)
        expect(flashService.error).toHaveBeenCalledExactlyOnceWith(t('ws_route_unknow', {route_name: "wsRoute"}))
    });

    it("init connection si socket route n'existe pas", () => {
        vi.spyOn(Socket, 'open')
        
        const res = websocketService.register('wsRoute', 'testEvent', vi.fn());

        expect(res).toBe(true)
        expect(Socket.open).toHaveBeenCalledExactlyOnceWith('wsRoute')

        websocketService.close('wsRoute')
    });

    it("enregistre l'event", () => {
        websocketService.open('wsRoute')

        const res = websocketService.register('wsRoute', 'testEvent', vi.fn());

        expect(res).toBe(true)

        expect(EventWs.exist('wsRoute')).toBeDefined();

        websocketService.close('wsRoute')
    });
});

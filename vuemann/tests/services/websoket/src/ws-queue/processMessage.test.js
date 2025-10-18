import { describe, it, expect, vi, beforeEach, afterEach, beforeAll } from 'vitest';
import { websocketService } from '@brugmann/vuemann/src/services/websocket/init/websocket-service.js';
import { websocketFunctions, websocketFunctionsInternal } from '@brugmann/vuemann/src/services/websocket/src/websocket-functions.js';
import {createPinia, setActivePinia} from "pinia";
import { t } from '@brugmann/vuemann/src/services/services-helper.js';
import { flashService } from '@brugmann/vuemann/src/services/flash/init/flash-service.js';
import { WebsocketMock } from '&/utils/mocks/websocket-mock.js';
import { EventWs } from '@brugmann/vuemann/src/services/websocket/src/models/event-ws.js';
import { wsQueue } from '@brugmann/vuemann/src/services/websocket/src/models/ws-queue.js';

describe('processMessage', () => {
    beforeEach(() => {
        setActivePinia(createPinia())
        vi.stubGlobal('WebSocket', WebsocketMock)
        vi.spyOn(console, 'log').mockReturnValue(false);
    });

    afterEach(() => {
        vi.restoreAllMocks()
        vi.unstubAllGlobals()
    });

    it('ignore les messages mal formés', () => {
        vi.spyOn(flashService, 'error').mockReturnValue({})
        vi.spyOn(websocketFunctions, 'getJsonFromData')
        
        EventWs.register('wsRoute', 'testEvent', vi.fn());

        wsQueue.processMessage('wsRoute', { data: "Invalid JSON" });

        expect(websocketFunctions.getJsonFromData).toHaveBeenCalledWith("Invalid JSON");

        websocketService.close('wsRoute')
    });

    it('doit retourner une erreur si datas.event est manquant', () => {
        vi.spyOn(flashService, 'error').mockReturnValue(false);

        wsQueue.processMessage('wsRoute', { data: JSON.stringify({ data: { key: 'value' } }) });
    
        expect(flashService.error).toHaveBeenCalledWith(t('ws_data_no_event', { route_name: 'wsRoute' }));
    });
    
    it("ne doit pas exécuter l'événement si EventWs.prevent retourne true", () => {
        vi.spyOn(EventWs, 'prevent').mockReturnValue(true);

        const eventMock = vi.fn();
        websocketService.register('wsRoute', 'testEvent', eventMock);

        wsQueue.processMessage('wsRoute', { data: JSON.stringify({ event: 'testEvent', data: { key: 'value' } }) });
    
        expect(eventMock).not.toHaveBeenCalled();
        
        websocketService.close('wsRoute')
      });

    it('events ping ', () => {
        vi.spyOn(console, 'log').mockReturnValue(false);

        wsQueue.processMessage('wsRoute', {
            data: JSON.stringify({ event: 'ping', payload: 'data' })
        });

        expect(console.log).toHaveBeenCalledExactlyOnceWith(t('ws_global_event', { event : 'ping', route_name : 'wsRoute' }));
    });

    it('events connected', () => {
        vi.spyOn(console, 'log').mockReturnValue(false);

        wsQueue.processMessage('wsRoute', {
            data: JSON.stringify({ event: 'connected', payload: 'data' })
        });

        expect(console.log).toHaveBeenCalledExactlyOnceWith(t('ws_global_event', { event : 'connected', route_name : 'wsRoute' }));
    });

    it('should return an error when service has no event for route_name', () => {
        vi.spyOn(flashService, 'error').mockReturnValue(false)

        wsQueue.processMessage('some_route', { data: '{"event": "some_event"}' });
    
        expect(flashService.error).toHaveBeenCalledWith(t('ws_event_no', { route_name: 'some_route' }));
    });

    it('should return an error when event is not defined in events for route_name', () => {
        vi.spyOn(flashService, 'error').mockReturnValue(false)
        websocketService.open('wsRoute')
        websocketService.register('wsRoute', 'event_test', vi.fn())
        
        wsQueue.processMessage('wsRoute', { data: '{"event": "some_event"}' });

        expect(flashService.error).toHaveBeenCalledWith(t('ws_event_unknow', { route_name: 'wsRoute', event: 'some_event' }));
        
        websocketService.close('wsRoute')
    });

    it('should execute the event when all conditions are methode', () => {
        const eventMock = vi.fn()

        websocketService.open('wsRoute')
        websocketService.register('wsRoute', 'event_test', eventMock)

        wsQueue.processMessage('wsRoute', { data: '{"event": "event_test"}' });

        expect(eventMock).toHaveBeenCalledExactlyOnceWith({event: "event_test"});
    });
});

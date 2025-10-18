import { describe, it, expect, vi, beforeEach, afterEach, beforeAll } from 'vitest';
import { websocketService } from '@brugmann/vuemann/src/services/websocket/init/websocket-service.js';
import { websocketFunctions, websocketFunctionsInternal } from '@brugmann/vuemann/src/services/websocket/src/websocket-functions.js';
import {createPinia, setActivePinia} from "pinia";
import { ConfigLoader } from '@brugmann/vuemann/src/config/config-loader.js';
import { apiToken } from '@brugmann/vuemann/src/services/auth/src/models/api-token.js';
import { flashService } from '@brugmann/vuemann/src/services/flash/init/flash-service.js';
import { t } from '@brugmann/vuemann/src/services/services-helper.js';
import { WebsocketMock } from '&/utils/mocks/websocket-mock.js';
import { Socket } from '@brugmann/vuemann/src/services/websocket/src/models/socket.js';

describe('websocketService', () => {
    beforeEach(() => {
        setActivePinia(createPinia())
        vi.stubGlobal('WebSocket', WebsocketMock)
        vi.spyOn(console, 'log').mockImplementation(() => {})
        vi.useFakeTimers()
    });

    afterEach(() => {
        vi.resetAllMocks()
        vi.unstubAllGlobals()
        vi.useRealTimers()
    });
    
    it('ne fait rien si WebSocket est désactivé', () => {
        vi.spyOn(websocketFunctions, 'generateUrlFromRoute')
        vi.spyOn(ConfigLoader, 'get').mockReturnValue("false")

        const res = websocketService.open('wsRoute');

        expect(res).toBe(false)
        expect(websocketFunctions.generateUrlFromRoute).not.toHaveBeenCalled();
    });

    it(`renvoie une erreur si la route n'existe pas`, () => {
        vi.spyOn(flashService, 'error').mockReturnValue(false)
        vi.spyOn(websocketFunctionsInternal, 'getRouteFromConfig').mockReturnValue('ws_route_unknow')
        vi.spyOn(websocketFunctions, 'generateUrlFromRoute')

        const res = websocketService.open('some_route');

        expect(res).toBe(false)
        expect(websocketFunctions.generateUrlFromRoute).not.toHaveBeenCalled();
        expect(flashService.error).toHaveBeenCalledExactlyOnceWith(t('ws_route_unknow', {route_name : 'some_route'}));
    });

    it('route déjà existante', () => {
        websocketService.open('wsRoute');
        
        vi.spyOn(websocketFunctions, 'generateUrlFromRoute')
        vi.spyOn(flashService, 'error').mockReturnValue(false)
        
        const res = websocketService.open('wsRoute');
        
        expect(res).toBe(false)
        expect(websocketFunctions.generateUrlFromRoute).not.toHaveBeenCalled();
        expect(flashService.error).toHaveBeenCalledExactlyOnceWith(t('ws_route_already_exist'));
        
        websocketService.close('wsRoute')
    });
    
    it('ouvre une connexion WebSocket et envoie le token', () => {        
        apiToken.setAccessToken('testApi', 'fake-token')
        
        const res = websocketService.open('wsRoute');
        expect(res).toBe(true)
        
        const wsRoute = Socket.get('wsRoute')
        expect(wsRoute).toBeDefined()
        expect(wsRoute.url).toBe('www.testApi.fr/testRoute');
        
        expect(wsRoute.addEventListener).toHaveBeenCalledWith('open', expect.any(Function));

        wsRoute.dispatchEvent(new Event('open'));
        expect(wsRoute.send).toHaveBeenCalledWith(JSON.stringify({ "type": "auth", "token" : 'Bearer fake-token' }));
        expect(wsRoute.addEventListener).toHaveBeenCalledWith('open', expect.any(Function));
        expect(wsRoute.addEventListener).toHaveBeenCalledWith('message', expect.any(Function));
        expect(wsRoute.addEventListener).toHaveBeenCalledWith('close', expect.any(Function));
        expect(wsRoute.name).toBe('wsRoute')

        Socket.close('wsRoute')
    });
});

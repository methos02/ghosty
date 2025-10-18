import { describe, it, expect, vi, afterEach, beforeEach } from 'vitest';
import { WebsocketMock } from '&/utils/mocks/websocket-mock.js';
import { websocketService } from '@brugmann/vuemann/src/services/websocket/init/websocket-service.js';
import { authService } from '@brugmann/vuemann/src/services/auth/init/auth-service.js';
import { websocketFunctionsInternal } from '@brugmann/vuemann/src/services/websocket/src/websocket-functions.js';
import { t } from '@brugmann/vuemann/src/services/services-helper.js';
import { Socket, SocketInternal } from '@brugmann/vuemann/src/services/websocket/src/models/socket.js';

describe('wsOnOpen', () => {
    beforeEach(() => {
        vi.stubGlobal('WebSocket', WebsocketMock)
        vi.spyOn(console, 'log').mockReturnValue(false);
    });
    
    afterEach(() =>{ 
        vi.unstubAllGlobals()
        vi.resetAllMocks()
    });

    it('should send an authentication message when route is valid', () => {
        websocketService.open('wsRoute')
        const route = websocketFunctionsInternal.getRouteFromConfig('wsRoute')
        const socket = Socket.get(route.name)
        
        vi.spyOn(authService, 'getAccessToken').mockReturnValue('token_test')
        vi.spyOn(socket, 'send').mockReturnValue(true)
        vi.spyOn(console, 'log').mockReturnValue(true)

        SocketInternal.wsOnOpen(route);
  
        expect(socket.send).toHaveBeenCalledWith(
            JSON.stringify({ type: 'auth', token: 'Bearer token_test' })
        );

        expect(console.log).toHaveBeenCalledExactlyOnceWith(t('ws_open', { route_name : route.name }))
    });
  });

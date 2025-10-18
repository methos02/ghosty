import { describe, it, expect, vi, afterEach, beforeEach } from 'vitest';
import { websocketService } from '@brugmann/vuemann/src/services/websocket/init/websocket-service.js';
import { WebsocketMock } from '&/utils/mocks/websocket-mock.js';
import { Socket, SocketInternal } from '@brugmann/vuemann/src/services/websocket/src/models/socket.js';
import { EventWs } from '@brugmann/vuemann/src/services/websocket/src/models/event-ws.js';

describe('close', () => {
    beforeEach(() => {
        vi.stubGlobal('WebSocket', WebsocketMock)
        vi.useFakeTimers()
        vi.spyOn(console, 'log').mockReturnValue(false);
    });
    afterEach(() => {
        vi.unstubAllGlobals()
        vi.resetAllMocks()
        vi.useRealTimers()
    });

    it('route inconnue - nettoyage silencieux sans erreur', () => {
        vi.spyOn(EventWs, 'deleteRouteEvents')
        
        const result = websocketService.close('some_route');
        
        expect(EventWs.deleteRouteEvents).toHaveBeenCalledWith('some_route')
        expect(result).toBe('close_partial')
    });

    it('should close the socket and delete entries when socket is defined', () => {
        websocketService.open('wsRoute')
        websocketService.register('wsRoute', 'testEvent', vi.fn())

        const result = websocketService.close('wsRoute');

        expect(Socket.exist('wsRoute')).toBeFalsy();
        expect(EventWs.routeExist('wsRoute')).toBeFalsy();
        expect(result).toBe('close_totaly')
    });

    it('marque la fermeture comme manuelle et empêche la reconnection', () => {
        // vi.spyOn(console, 'log').mockImplementation(() => {})
        vi.spyOn(SocketInternal, 'startReconnection')
        
        websocketService.open('wsRoute')
        const result = websocketService.close('wsRoute')
        
        expect(SocketInternal.startReconnection).not.toHaveBeenCalled()
        expect(result).toBe('close_totaly')
    });

    it("arrête la reconnection en cours même si la socket n'existe pas", () => {
        vi.spyOn(console, 'log').mockImplementation(() => {})
        vi.spyOn(SocketInternal, 'stopReconnection')
        vi.spyOn(Socket, 'open').mockImplementation(() => {})
        
        SocketInternal.startReconnection('wsRoute')
        expect(vi.getTimerCount()).toBe(1)
        
        const result = websocketService.close('wsRoute')
        
        expect(SocketInternal.stopReconnection).toHaveBeenCalledWith('wsRoute')
        expect(vi.getTimerCount()).toBe(0)
        expect(result).toBe('close_partial')
    });
});

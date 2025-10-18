import { describe, it, expect, vi, beforeEach, afterEach, beforeAll } from 'vitest';
import { websocketService } from '@brugmann/vuemann/src/services/websocket/init/websocket-service.js';
import { WebsocketMock } from '&/utils/mocks/websocket-mock.js';
import { Socket, SocketInternal } from '@brugmann/vuemann/src/services/websocket/src/models/socket.js';
import { createPinia, setActivePinia } from "pinia";
import { localeService } from '@brugmann/vuemann/src/services/locale/init/locale-service.js';

describe('Reconnection WebSocket', () => {
    beforeEach(() => {
        setActivePinia(createPinia())
        vi.stubGlobal('WebSocket', WebsocketMock)
        vi.useFakeTimers()
    });

    afterEach(() => {
        vi.resetAllMocks()
        vi.unstubAllGlobals()
        vi.useRealTimers()
    });

    describe('fermeture manuelle vs automatique', () => {
        it('ne reconnecte pas après une fermeture manuelle', () => {
            vi.spyOn(console, 'log').mockImplementation(() => {})
            vi.spyOn(SocketInternal, 'startReconnection')
            
            websocketService.open('wsRoute')
            // Ouvrir et fermer manuellement
            websocketService.close('wsRoute')
            
            expect(SocketInternal.startReconnection).not.toHaveBeenCalled()
        });

        it('reconnecte après une fermeture automatique/inattendue', () => {
            vi.spyOn(console, 'log').mockImplementation(() => {})
            vi.spyOn(SocketInternal, 'startReconnection')
            
            websocketService.open('wsRoute')
            const socket = Socket.get('wsRoute')
            
            // Simuler une fermeture automatique (événement close)
            socket.dispatchEvent(new Event('close'))
            
            expect(SocketInternal.startReconnection).toHaveBeenCalledWith('wsRoute')
            websocketService.close('wsRoute')
        });
    });

    describe('startReconnection', () => {
        it('lance des tentatives de reconnection à intervalle régulier', () => {
            vi.spyOn(console, 'log').mockImplementation(() => {})
            vi.spyOn(Socket, 'open').mockImplementation(() => {})
            
            SocketInternal.startReconnection('wsRoute')
            
            vi.advanceTimersByTime(1000)
            
            expect(Socket.open).toHaveBeenCalledWith('wsRoute')
            
            vi.advanceTimersByTime(1000)
            
            expect(Socket.open).toHaveBeenCalledTimes(2)
            Socket.close('wsRoute')
        });

        it('ne démarre pas la reconnection si elle est déjà en cours', () => {
            vi.spyOn(console, 'log').mockImplementation(() => {})
            vi.spyOn(Socket, 'open').mockImplementation(() => {})
            
            SocketInternal.startReconnection('wsRoute')
            SocketInternal.startReconnection('wsRoute')
            
            expect(vi.getTimerCount()).toBe(1)
            SocketInternal.stopReconnection('wsRoute')
        });

        it('arrête la reconnection si la socket existe déjà', () => {
            vi.spyOn(console, 'log').mockImplementation(() => {})
            vi.spyOn(SocketInternal, 'stopReconnection')

            websocketService.open('wsRoute')

            SocketInternal.startReconnection('wsRoute')
            vi.advanceTimersByTime(1000)

            expect(SocketInternal.stopReconnection).toHaveBeenCalledWith('wsRoute')

            websocketService.close('wsRoute')
        });
    });

    describe('stopReconnection', () => {
        it('arrête la reconnection en cours', () => {
            vi.spyOn(console, 'log').mockImplementation(() => {})
            vi.spyOn(Socket, 'open').mockImplementation(() => {})
            vi.spyOn(localeService, 't').mockImplementation(() => {})
            
            SocketInternal.startReconnection('wsRoute')
            expect(vi.getTimerCount()).toBe(1)
            
            SocketInternal.stopReconnection('wsRoute')
            expect(vi.getTimerCount()).toBe(0)
            expect(localeService.t).toHaveBeenCalledWith('ws_reconnection_stopped', {route_name : 'wsRoute'})
        });

        it('ne fait rien si aucune reconnection en cours', () => {
            vi.spyOn(console, 'log').mockImplementation(() => {})
            vi.spyOn(localeService, 't').mockImplementation(() => {})

            // Tentative d'arrêt sans reconnection en cours
            expect(localeService.t).not.toHaveBeenCalled()
        });
    });
}); 

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { WebsocketMock } from '&/utils/mocks/websocket-mock.js';
import { Socket } from '@brugmann/vuemann/src/services/websocket/src/models/socket.js';
import { websocketFunctions } from '@brugmann/vuemann/src/services/websocket/src/websocket-functions.js';

describe('getSocket', () => {
  beforeEach(() => {
    vi.stubGlobal('WebSocket', WebsocketMock)
    vi.spyOn(console, 'log').mockReturnValue(false);
  });
  
  afterEach(() => {
    vi.unstubAllGlobals()
    vi.resetAllMocks()
  });

  it('should return the good socket or undefined', () => {
    Socket.open('wsRoute')

    expect(Socket.get('wsRoute').name).toBe('wsRoute');
    expect(Socket.get('unknowRoute')).toBe(undefined);

    Socket.close('wsRoute')
  });

  it('should return all sockets', () => {
    vi.spyOn(websocketFunctions, 'getRoute').mockReturnValue({name: 'wsRoute'})
    vi.spyOn(websocketFunctions, 'generateUrlFromRoute').mockReturnValue('ws://localhost:8080/wsRoute')
    
    Socket.open('wsRoute')
    Socket.open('wsRoute2')

    const sockets = Socket.get()
    expect(Object.keys(sockets).length).toBe(2)
    expect(sockets.wsRoute.name).toBe('wsRoute')
    expect(sockets.wsRoute2.name).toBe('wsRoute2')

    Socket.close('wsRoute')
    Socket.close('wsRoute2')
  })
});

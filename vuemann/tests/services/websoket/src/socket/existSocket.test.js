import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { websocketService } from '@brugmann/vuemann/src/services/websocket/init/websocket-service.js';
import { WebsocketMock } from '&/utils/mocks/websocket-mock.js';
import { Socket } from '@brugmann/vuemann/src/services/websocket/src/models/socket.js';

describe('hasSocket', () => {
  beforeEach(() => {
    vi.stubGlobal('WebSocket', WebsocketMock)
    vi.spyOn(console, 'log').mockReturnValue(false);
  });

  afterEach(() => {
    vi.unstubAllGlobals()
    vi.resetAllMocks()
  });

  it('should return the good socket state', () => {
    Socket.open('wsRoute')

    expect(Socket.exist('wsRoute')).toBe(true);
    expect(Socket.exist('unknowRoute')).toBe(false);

    websocketService.close('wsRoute')
  });
});

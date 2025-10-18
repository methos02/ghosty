import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { websocketService } from '@brugmann/vuemann/src/services/websocket/init/websocket-service.js';
import { WebsocketMock } from '&/utils/mocks/websocket-mock.js';
import { EventWs } from '@brugmann/vuemann/src/services/websocket/src/models/event-ws.js';

describe('hasEvent', () => {
  beforeEach(() => {
    vi.stubGlobal('WebSocket', WebsocketMock)
    vi.spyOn(console, 'log').mockReturnValue(false);
  });
  afterEach(() => {
    vi.unstubAllGlobals()
    vi.resetAllMocks()
  });

  it('should return the good event state', () => {
    EventWs.register('wsRoute', 'eventTest', vi.fn())

    expect(EventWs.exist('wsRoute', 'eventTest')).toBe(true);
    expect(EventWs.exist('wsRoute', 'unknownEvent')).toBe(false);

    websocketService.close('wsRoute')
  });
});

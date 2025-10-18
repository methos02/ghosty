// registerPrevent.test.js
import { describe, it, expect } from 'vitest';
import { EventWs } from '@brugmann/vuemann/src/services/websocket/src/models/event-ws.js';

describe('registerPrevent', () => {
  it('crée un nouvel objet pour une route inexistante et enregistre l\'événement', () => {
    EventWs.registerPrevent('route1', 'eventA', { key: 'value' });
    
    expect(EventWs.hasPrevent('route1', 'eventA')).toBeTruthy();
    expect(EventWs.getPrevent('route1', 'eventA')).toEqual({ key: 'value' });
  });

  it('ajoute un nouvel événement à une route déjà existante', () => {
    EventWs.registerPrevent('route1', 'eventA', { key: 'value' });
    EventWs.registerPrevent('route1', 'eventB', { key2: 'value2' });

    expect(EventWs.hasPrevent('route1', 'eventB')).toBeTruthy();
    expect(EventWs.getPrevent('route1', 'eventA')).toEqual({ key: 'value' });
    expect(EventWs.getPrevent('route1', 'eventB')).toEqual({ key2: 'value2' });
  });

  it('écrase les données d’un événement déjà enregistré pour une route', () => {
    EventWs.registerPrevent('route1', 'eventA', { key: 'value' });
    EventWs.registerPrevent('route1', 'eventA', { key: 'newValue' });

    expect(EventWs.getPrevent('route1', 'eventA')).toEqual({ key: 'newValue' });
  });
});

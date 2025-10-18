// prevent.test.js
import { describe, it, expect } from 'vitest';
import { EventWs } from '@brugmann/vuemann/src/services/websocket/src/models/event-ws.js';

describe('prevent', () => {
  it("retourne false quand la route n'existe pas dans prevents", () => {
    const result = EventWs.prevent('nonexist_route', 'exist_event', { id: 1 });
    expect(result).toBe(false);
  });

  it("retourne false quand l'événement n'existe pas pour la route donnée", () => {
    EventWs.registerPrevent('route1', 'exist_event', { id: 1 })
    const result = EventWs.prevent('route1', 'nonexist_event', { id: 1 });
    expect(result).toBe(false);
  });

  it("retourne false quand la valeur d'event_datas ne correspond pas", () => {
    EventWs.registerPrevent('route1', 'exist_event', { id: 1 })
    const result = EventWs.prevent('route1', 'exist_event', { id: 2 });
    expect(result).toBe(false);
  });

  it('retourne false quand une valeur dans event_datas ne correspond pas', () => {
    EventWs.registerPrevent('route1', 'exist_event', { id: 1, key2: 'good_value' })
    const result = EventWs.prevent('route1', 'exist_event', { id: 1, key2: 'wrong_value' });
    expect(result).toBe(false);
  });

  it('retourne true quand event_datas correspond exactement aux clés et valeurs requises', () => {
    EventWs.registerPrevent('route1', 'exist_event', { id: 1 })
    const result = EventWs.prevent('route1', 'exist_event', { id: 1 });
    expect(result).toBe(true);
    expect(EventWs.hasPrevent('route1', 'exist_event')).toBeFalsy()
  });

  it("retourne false si l'objet dans event_datas ne contient pas toutes les propriétés requises", () => {
    EventWs.registerPrevent('route1', 'exist_event', { key1: { username: 'test' } })

    const result = EventWs.prevent('route1', 'exist_event', { key1: { id: 1 } });
    expect(result).toBe(false);
  });

  it('retourne true quand event_datas contient des clés supplémentaires mais que les clés requises sont correctes', () => {
    EventWs.registerPrevent('route1', 'exist_event', { id: 1 })
    const result = EventWs.prevent('route1', 'exist_event', { id: 1, key2: 'value2' });
    expect(result).toBe(true);
    expect(EventWs.hasPrevent('route1', 'exist_event')).toBeFalsy()
  });

  it('accepte un objet si prevents est un sous-ensemble de event_datas', () => {
    EventWs.registerPrevent('route1', 'exist_event', { key1: { username: 'test' } })

    const result = EventWs.prevent('route1', 'exist_event', { key1: { username: 'test', id: 1 } })
    expect(result).toBe(true);
    expect(EventWs.hasPrevent('route1', 'exist_event')).toBeFalsy()
  });
});

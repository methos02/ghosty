import { EventWs } from "@brugmann/vuemann/src/services/websocket/src/models/event-ws.js";
import { describe, expect, it } from "vitest";

describe('hasPrevent', () => {
    it("retourne true si la route et l'événement existent", () => {
        EventWs.registerPrevent('route1', 'eventA', {id: 1})
        EventWs.registerPrevent('route1', 'eventB', {id: 1})
        EventWs.registerPrevent('route2', 'eventC', {id: 1})

      expect(EventWs.hasPrevent('route1', 'eventA')).toBe(true);
      expect(EventWs.hasPrevent('route1', 'eventB')).toBe(true);
      expect(EventWs.hasPrevent('route2', 'eventC')).toBe(true);
    });
  
    it("retourne false si la route n'existe pas", () => {
        EventWs.registerPrevent('route1', 'eventA', {id: 1})

        expect(EventWs.hasPrevent('routeNonExistent', 'eventA')).toBe(false);
    });
  
    it("retourne false si l'événement n'existe pas sur la route", () => {
        EventWs.registerPrevent('route1', 'eventA', {id: 1})

        expect(EventWs.hasPrevent('route1', 'eventC')).toBe(false);
    });
  });

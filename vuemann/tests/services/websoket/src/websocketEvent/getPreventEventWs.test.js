import { describe, expect, it } from "vitest";
import { EventWs } from "@brugmann/vuemann/src/services/websocket/src/models/event-ws.js";

describe('getPrevent', () => {
    it("retourne les données de l'événement si elles existent", () => {
        EventWs.registerPrevent('route1', 'eventA', {id: 1})
        EventWs.registerPrevent('route2', 'eventC', {id: 2})

        expect(EventWs.getPrevent('route1', 'eventA')).toEqual({id: 1});
        expect(EventWs.getPrevent('route2', 'eventC')).toEqual({id: 2});
    });
  
    it("retourne undefined si la route n'existe pas", () => {
        expect(EventWs.getPrevent('routeNonExistent', 'eventA')).toBeUndefined();
    });
  
    it("retourne undefined si l'événement n'existe pas sur la route", () => {
        expect(EventWs.getPrevent('route1', 'eventNonExistent')).toBeUndefined();
    });
  });

import { flashService } from '@brugmann/vuemann/src/services/flash/init/flash-service.js';
import { t } from '@brugmann/vuemann/src/services/services-helper.js';
import { websocketFunctions, websocketFunctionsInternal } from '@brugmann/vuemann/src/services/websocket/src/websocket-functions.js';
import { describe, it, expect, vi } from 'vitest';

describe('getRoute', () => {
  it('should return an error when getRouteFromConfig returns a string', () => {
    vi.spyOn(websocketFunctionsInternal, 'getRouteFromConfig').mockReturnValue('ws_route_unknow')
    vi.spyOn(flashService, 'error').mockReturnValue(false)

    const result = websocketFunctions.getRoute('some_route');

    expect(flashService.error).toHaveBeenCalledWith(t('ws_route_unknow', { route_name: 'some_route' }));
    expect(websocketFunctionsInternal.getRouteFromConfig).toHaveBeenCalledExactlyOnceWith('some_route');
    expect(result).toBe(false);
  });

  it('should return the route when getRouteFromConfig returns an object', () => {
    const routeObject = { path: '/some_path' }
    vi.spyOn(websocketFunctionsInternal, 'getRouteFromConfig').mockReturnValue(routeObject)

    const result = websocketFunctions.getRoute('some_route');

    expect(result).toBe(routeObject);
  });
});

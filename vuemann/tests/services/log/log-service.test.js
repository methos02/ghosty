import { describe, it, expect, vi, afterEach } from 'vitest';
import { logService } from '@brugmann/vuemann/src/services/log/init/log-service.js';
import * as servicesHelper from '@brugmann/vuemann/src/services/services-helper.js';
import { servicesM } from '@brugmann/vuemann/src/services/services-manager.js';
import { ConfigLoader } from '@brugmann/vuemann/src/config/config-loader.js';

describe('logService', () => {
  const OLD_ENV = process.env

  afterEach(() => { 
    process.env = { ...OLD_ENV };
    vi.clearAllMocks() 
  });

  it('loggue en console si la route log est absente', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    vi.spyOn(servicesM, 'service').mockReturnValue(false);
    process.env.VITE_ENV = 'prod';

    await logService.send('Erreur test', { foo: 'bar' });

    expect(console.error).toHaveBeenCalledWith('Erreur test', { foo: 'bar' });
    expect(console.error).toHaveBeenCalledWith(expect.stringContaining('La route "log"'));
  });

  it('envoie la requête si la route log existe', async () => {
    vi.spyOn(servicesM, 'service').mockImplementation((name) => name === 'router:hasApiRoute' ? true : undefined);
    vi.spyOn(servicesHelper, 'req').mockResolvedValue({});
    process.env.VITE_ENV = 'prod';

    await logService.send(new Error('Erreur critique'), { foo: 'bar' });

    expect(servicesHelper.req).toHaveBeenCalledWith('log', expect.objectContaining({ message: 'Erreur critique', foo: 'bar', app: ConfigLoader.get('app.name') }), {"log": false});
  });
}); 

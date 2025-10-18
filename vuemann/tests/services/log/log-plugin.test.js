import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { logPlugin } from '@brugmann/vuemann/src/services/log/init/log-plugin.js';
import { logService } from '@brugmann/vuemann/src/services/log/init/log-service.js';
import { createPinia, setActivePinia } from 'pinia';
import { useUtilsStore } from '@brugmann/vuemann/src/services/utils/src/utils-store.js';

describe('logPlugin', () => {
  const OLD_ENV = process.env

  beforeEach(() => {
    setActivePinia(createPinia())
    global.fetch = vi.fn().mockResolvedValue({
      json: () => Promise.resolve({ version: '1.2.3' })
  })
  })

  afterEach(() => {
    process.env = { ...OLD_ENV };
    vi.clearAllMocks() 
  });

  it("installe un errorHandler sur app.config si environnement pas dev", () => {
    const app = { config: {} };
    process.env.VITE_ENV = 'prod';

    logPlugin().install(app);

    expect(typeof app.config.errorHandler).toBe('function');
  });

  it("ne pas installer un errorHandler sur app.config si environnement dev", () => {
    const app = { config: {} };
    process.env.VITE_ENV = 'dev';

    logPlugin().install(app);

    expect(typeof app.config.errorHandler).not.toBe(undefined);
  });

  it('le errorHandler appelle logService.send', async () => {
    const app = { config: {} };
    process.env.VITE_ENV = 'prod';

    logPlugin().install(app);

    vi.spyOn(console, 'error').mockImplementation(() => {});
    vi.spyOn(logService, 'send').mockImplementation(() => {});

    const err = new Error('Erreur plugin');
    await app.config.errorHandler(err, {}, 'info');

    expect(logService.send).toHaveBeenCalledWith(err, { info: 'info' });
  });

  it('met à jour needUpdate si version différente', async () => {
    const utilsStore = useUtilsStore()
    const app = { config: {}, provides: { appVersion: '0.1.1' } };
    process.env.VITE_ENV = 'prod';
    
    logPlugin().install(app);

    vi.spyOn(logService, 'send').mockImplementation(() => {});

    expect(utilsStore.needUpdate).toBe(false);
    
    const err = new Error('Erreur plugin');
    await app.config.errorHandler(err, {}, 'info');

    expect(logService.send).toHaveBeenCalledWith(err, { info: 'info' });
    expect(utilsStore.needUpdate).toBe(true);
  });
}); 

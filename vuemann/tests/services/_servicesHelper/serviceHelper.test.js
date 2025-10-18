import { describe, it, expect, vi, beforeEach, afterAll } from 'vitest';
import { req, t, ws, form, log, locale, ajax, flash, router, route, url } from '../../../src/services/services-helper';

describe('services Helper', () => {
  it('helper t()', () => {
    vi.spyOn(locale, 't').mockImplementation(() => {})
    t('translate');
    
    expect(locale.t).toHaveBeenCalledOnce();
  });

  it('helper req()', () => {
    vi.spyOn(ajax, 'req').mockImplementation(() => {})
    req('route_name');
    
    expect(ajax.req).toHaveBeenCalledOnce();
  });
  
  it('helper flash.success())', () => {
    vi.spyOn(flash, 'success').mockImplementation(() => {})
    flash.success('success_message');
    
    expect(flash.success).toHaveBeenCalledOnce();
  });
  
  it('helper flash.error())', () => {
    vi.spyOn(flash, 'error').mockImplementation(() => {})
    flash.error('success_message');
    
    expect(flash.error).toHaveBeenCalledOnce();
  });

  it('helper ws.open())', () => {
    vi.spyOn(ws, 'open').mockImplementation(() => {})
    ws.open();
    
    expect(ws.open).toHaveBeenCalledOnce();
  });

  it('helper ws.register())', () => {
    vi.spyOn(ws, 'register').mockImplementation(() => {})
    ws.register();
    
    expect(ws.register).toHaveBeenCalledOnce();
  });

  it('helper ws.registerPrevent())', () => {
    vi.spyOn(ws, 'registerPrevent').mockImplementation(() => {})
    ws.registerPrevent();
    
    expect(ws.registerPrevent).toHaveBeenCalledOnce();
  });

  it('helper ws.hasPrevent())', () => {
    vi.spyOn(ws, 'hasPrevent').mockImplementation(() => {})
    ws.hasPrevent();
    
    expect(ws.hasPrevent).toHaveBeenCalledOnce();
  });

  it('helper ws.getPrevent())', () => {
    vi.spyOn(ws, 'getPrevent').mockImplementation(() => {})
    ws.getPrevent();
    
    expect(ws.getPrevent).toHaveBeenCalledOnce();
  });

  it('helper ws.close())', () => {
    vi.spyOn(ws, 'close').mockImplementation(() => {})
    ws.close();
    
    expect(ws.close).toHaveBeenCalledOnce();
  });

  it('helper form getErrors())', () => {
    vi.spyOn(form, 'getErrors').mockImplementation(() => {})
    form.getErrors();
    
    expect(form.getErrors).toHaveBeenCalledOnce();
  });
  
  it('helper form getError())', () => {
    vi.spyOn(form, 'getError').mockImplementation(() => {})
    form.getError('input_name');
    
    expect(form.getError).toHaveBeenCalledWith('input_name');
  });
  
  it('helper form hasError())', () => {
    vi.spyOn(form, 'hasError').mockImplementation(() => {})
    form.hasError('input_name');
    
    expect(form.hasError).toHaveBeenCalledWith('input_name');
  });

  it('helper form addError())', () => {
    vi.spyOn(form, 'addError').mockImplementation(() => {})
    form.addError('input_name', 'error_message');
    
    expect(form.addError).toHaveBeenCalledWith('input_name', 'error_message');
  });
  
  it('helper form clearError())', () => {
    vi.spyOn(form, 'clearError').mockImplementation(() => {})
    form.clearError('input_name');
    
    expect(form.clearError).toHaveBeenCalledWith('input_name');
  });

  it('helper form clearErrors())', () => {
    vi.spyOn(form, 'clearErrors').mockImplementation(() => {})
    form.clearErrors();
    
    expect(form.clearErrors).toHaveBeenCalledOnce();
  });

  it('helper form validate())', () => {
    vi.spyOn(form, 'validate').mockImplementation(() => {})
    form.validate('rules', 'datas');
    expect(form.validate).toHaveBeenCalledWith('rules', 'datas');

    form.validate('rules', 'datas', { foo: 'bar' });
    expect(form.validate).toHaveBeenCalledWith('rules', 'datas', { foo: 'bar' });
  }); 

  it('helper router current())', () => {
    vi.spyOn(route, 'current').mockImplementation(() => {})
    route.current();
    
    expect(route.current).toHaveBeenCalledOnce();
  });

  it('helper router get())', () => {
    vi.spyOn(route, 'get').mockImplementation(() => {})
    route.get('param_name');
    
    expect(route.get).toHaveBeenCalledWith('param_name');
  });
  
  it('helper router push())', () => {
    vi.spyOn(router, 'push').mockImplementation(() => {})
    router.push('route_url');
    
    expect(router.push).toHaveBeenCalledWith('route_url');
  });

  it('helper router hasRoute())', () => {
    vi.spyOn(router, 'hasRoute').mockImplementation(() => {})
    router.hasRoute('route_name');
    
    expect(router.hasRoute).toHaveBeenCalledWith('route_name');
  });

  it('helper router getRoutes())', () => {
    vi.spyOn(router, 'getRoutes').mockImplementation(() => {})
    router.getRoutes();
    
    expect(router.getRoutes).toHaveBeenCalledOnce();
  });

  it('helper router has())', () => {
    vi.spyOn(route, 'has').mockImplementation(() => {})
    route.has('param_name');
    
    expect(route.has).toHaveBeenCalledWith('param_name');
  });

  it('helper log.send())', () => {
    vi.spyOn(log, 'send').mockImplementation(() => {})
    log.send('error_message', { foo: 'bar' });
    
    expect(log.send).toHaveBeenCalledWith('error_message', { foo: 'bar' });
  });

  it('helper url.generateUrl())', () => {
    vi.spyOn(url, 'generateUrl').mockImplementation(() => {})
    url.generateUrl('user.show', { id: 123 }, 'api');
    
    expect(url.generateUrl).toHaveBeenCalledWith('user.show', { id: 123 }, 'api');
  });

  it('helper url.generateUrl() avec paramètres par défaut', () => {
    vi.spyOn(url, 'generateUrl').mockImplementation(() => {})
    url.generateUrl('user.index');
    
    expect(url.generateUrl).toHaveBeenCalledWith('user.index');
  });

  it('helper url.generateSubdirectory())', () => {
    vi.spyOn(url, 'generateSubdirectory').mockImplementation(() => {})
    url.generateSubdirectory('user.show', { id: 123 });
    
    expect(url.generateSubdirectory).toHaveBeenCalledWith('user.show', { id: 123 });
  });

  it('helper url.generateSubdirectory() avec paramètres par défaut', () => {
    vi.spyOn(url, 'generateSubdirectory').mockImplementation(() => {})
    url.generateSubdirectory('user.index');
    
    expect(url.generateSubdirectory).toHaveBeenCalledWith('user.index');
  });
});

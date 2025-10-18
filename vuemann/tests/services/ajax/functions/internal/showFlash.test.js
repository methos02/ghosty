import { describe, it, expect, vi, afterEach, beforeEach, beforeAll } from 'vitest';
import { ajaxFunctionsInternal } from '@brugmann/vuemann/src/services/ajax/src/ajax-functions.js';
import { Request } from '@brugmann/vuemann/src/services/ajax/src/models/request.js';
import { flash } from '@brugmann/vuemann/src/services/services-helper.js';

describe('showFlash', () => {
    let requestId;

    beforeEach(() => {
        const route = { api: 'testApi', name: 'testRoute', method: 'get' };
        const datas = {};
        requestId = Request.init(route, datas);
        
        vi.spyOn(flash, 'error').mockReturnValue(false)
        vi.spyOn(flash, 'errorT').mockReturnValue(false)
    })
    afterEach(() => vi.resetAllMocks());

    it('should do nothing if Request.get("flash") is false', () => {
        Request.set({ flash: false }, requestId);
        const error = { 
            config: { requestId }, 
            response: { status: 400, data: {} } 
        };
        
        ajaxFunctionsInternal.showFlash(error);

        expect(flash.error).not.toHaveBeenCalled();
    });

    it('should do nothing if status is in Request.get("no-flash") array', () => {
        Request.set({ 'no-flash': [400] }, requestId);
        const error = { 
            config: { requestId }, 
            response: { status: 400, data: {} } 
        };
        
        ajaxFunctionsInternal.showFlash(error);

        expect(flash.error).not.toHaveBeenCalled();
    });

    it('should call flashError with error detail if defined', () => {
        const error = { 
            config: { requestId }, 
            response: { status: 400, data: { detail: 'Custom error message' } } 
        };
        
        ajaxFunctionsInternal.showFlash(error);

        expect(flash.error).toHaveBeenCalledWith('Custom error message');
    });

    it('should call flashError with "error_front" translation if status < 500', () => {
        const error = { 
            config: { requestId }, 
            response: { status: 400, data: {} } 
        };
        
        ajaxFunctionsInternal.showFlash(error);

        expect(flash.errorT).toHaveBeenCalledWith('error_front');
    });

    it('should call flashError with "error_back" translation if status >= 500', () => {
        const error = { 
            config: { requestId }, 
            response: { status: 500, data: {} } 
        };
        
        ajaxFunctionsInternal.showFlash(error);

        expect(flash.errorT).toHaveBeenCalledWith('error_back');
    });
});

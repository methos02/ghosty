import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ajaxFunctions, ajaxFunctionsInternal } from '@brugmann/vuemann/src/services/ajax/src/ajax-functions.js';
import { logService } from '@brugmann/vuemann/src/services/log/init/log-service.js';
import { Request } from '@brugmann/vuemann/src/services/ajax/src/models/request.js';

describe('manageError', () => {
    let requestId;

    beforeEach(() => {
        // Initialiser une requête pour chaque test
        const route = { api: 'testApi', name: 'testRoute', method: 'get' };
        const datas = {};
        requestId = Request.init(route, datas);
    });

    it('should return status 499 when error code is ERR_CANCELED', async () => {
        const error = { 
            code: 'ERR_CANCELED',
            config: { requestId }
        };
        const result = await ajaxFunctions.manageError(error);

        expect(result).toEqual({ data: {}, status: 499 });
    });

    it('should return status 500 when error.response is undefined', async () => {
        const error = { 
            config: { requestId }
        };
        const result = await ajaxFunctions.manageError(error);

        expect(result).toEqual({ data: { error : "error_back"}, status: 500 });
    });

    it('should call ajaxFunctionsInternal.showFlash and return error.response when error.response is defined', async () => {
        vi.spyOn(ajaxFunctionsInternal, 'showFlash').mockReturnValue(true)
        vi.spyOn(logService, 'send').mockReturnValue(true)

        const response = { data: 'Error message', status: 400 }
        const error = { 
            response,
            config: { requestId }
        };

        const result = await ajaxFunctions.manageError(error);

        expect(ajaxFunctionsInternal.showFlash).toHaveBeenCalledWith(error);
        expect(result).toBe(response);
    });

    it('should call logService.send when error.response.status is not 401', async () => {
        vi.spyOn(logService, 'send').mockReturnValue(true)
        const error = { 
            response: { status: 400, statusText: 'Error message' },
            config: { requestId }
        }

        await ajaxFunctions.manageError(error)
        
        expect(logService.send).toHaveBeenCalledWith(error.response.statusText, { 
            module: 'ajax', 
            "request": {
                api: 'testApi',
                id: requestId,
                params: undefined,
                route: {
                    api: 'testApi',
                    method: 'get',
                    name: 'testRoute'
                }
            }, 
            "response": {...error.response } 
        })
    })

    it('should not call logService.send when error.response.status is 401', async () => {
        vi.spyOn(logService, 'send').mockReturnValue(true)
        const error = { 
            response: { status: 401 },
            config: { requestId }
        }

        await ajaxFunctions.manageError(error)
        
        expect(logService.send).not.toHaveBeenCalled()
    })

    it('should not call logService.send when error.response.status is 404', async () => {
        vi.spyOn(logService, 'send').mockReturnValue(true)
        const error = { 
            response: { status: 404 },
            config: { requestId }
        }

        await ajaxFunctions.manageError(error)
        
        expect(logService.send).not.toHaveBeenCalled()
    })  

    it('should not call logService.send when error.response.status is 401 and log is false', async () => {
        vi.spyOn(logService, 'send').mockReturnValue(true)
        Request.set({ log: false }, requestId)
        const error = { 
            response: { status: 400 },
            config: { requestId }
        }

        await ajaxFunctions.manageError(error)
        
        expect(logService.send).not.toHaveBeenCalled()
    })
});

import { describe, it, expect, vi, beforeEach, beforeAll, afterAll, afterEach } from 'vitest';
import {createPinia, setActivePinia} from "pinia";
import { ajaxFunctions } from '@brugmann/vuemann/src/services/ajax/src/ajax-functions.js';
import { responseErrorInterceptor } from '@brugmann/vuemann/src/services/ajax/src/models/response-error-interceptor.js';
import { Request } from '@brugmann/vuemann/src/services/ajax/src/models/request.js';
import { authService } from "@brugmann/vuemann/src/services/auth/init/auth-service.js";

describe('interceptors response', async () => {
    let manageErrorMock;
    let requestId;

    beforeEach(() => {
        setActivePinia(createPinia())
        manageErrorMock = vi.spyOn(ajaxFunctions, 'manageError').mockReturnValue(false)
        
        // Initialiser une requête pour chaque test
        const route = { api: 'testApi', name: 'getRoute', method: 'get' };
        const datas = {};
        requestId = Request.init(route, datas);
    })

    afterEach(() => vi.resetAllMocks())

    it('if error without response key', async () => {
        const authMock = vi.spyOn(authService, 'refreshToken')
        const error = { config: { requestId } }

        await responseErrorInterceptor(error)

        expect(authMock).not.toBeCalled();
        expect(manageErrorMock).toBeCalled();
    });

    it('if retryRefresh equal false', async () => {
        const error = {response: { status: 401, detail: 'expired' }, config : { headers : {}, requestId }}
        const authMock = vi.spyOn(authService, 'refreshToken')
        Request.set({ retryRefresh : false }, requestId)
        
        await responseErrorInterceptor(error)

        expect(authMock).not.toBeCalled();
        expect(manageErrorMock).toBeCalledWith(error);
    });

    for(const status of [400, 401, 403, 404, 422, 500]) {  
        it(`refresh token status ${status} without details`, async () => {
            const error = {response: { status: 401, detail: 'expired' }, config : { headers : {}, requestId }}
            const authMock = vi.spyOn(authService, 'refreshToken').mockResolvedValue({status})
            
            await responseErrorInterceptor(error)
    
            expect(authMock).toBeCalled();
            expect(manageErrorMock).toBeCalledWith(error);
        })
    }

    it('rafraîchit le token si une erreur 401 est retournée', async () => {
        const authMock = vi.spyOn(authService, 'refreshToken').mockResolvedValue({ status: 200, access_token: 'newToken' })
        const resendRequestMock = vi.spyOn(ajaxFunctions, 'resendRequest').mockResolvedValue({ status: 200, data: { success: true }})
        
        const error = {response: { status: 401, detail: 'expired' }, config : { headers : {}, requestId }}
        const response = await responseErrorInterceptor(error)

        expect(response).toEqual({ data: { success: true }, status: 200, api: Request.get('api', requestId), route: Request.get('route', requestId) });

        expect(authMock).toHaveBeenCalled();
        expect(resendRequestMock).toHaveBeenCalled();
    });
})

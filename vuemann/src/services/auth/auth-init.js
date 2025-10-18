import { authService } from './init/auth-service.js'

export const authInit = {
    dependencies: ['ajax'],
    services: authService
}

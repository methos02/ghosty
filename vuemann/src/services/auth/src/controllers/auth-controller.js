import { authRepository } from '@brugmann/vuemann/src/services/auth/src/repositories/auth-repository.js'
import { STATUS } from '@brugmann/vuemann/src/services/ajax/ajax-constants.js'
import { AuthDto } from '@brugmann/vuemann/src/services/auth/src/dtos/auth-dto.js'

export const authController = {
    getUserGroups : async (username) => {
        const response = await authRepository.getUser(username)
        if(response.status !== STATUS.SUCCESS) { return false }

        const response_groups = await authRepository.getUserGroups(response.data.id)
        if(response_groups.status !== STATUS.SUCCESS) { return false }

        return AuthDto.groups(response_groups.data.groups)
    }
}

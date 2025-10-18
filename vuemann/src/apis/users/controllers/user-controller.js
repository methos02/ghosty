import { userDto } from "@brugmann/vuemann/src/apis/users/dtos/user-dto.js"
import { UserRepository } from "@brugmann/vuemann/src/apis/users/repositories/user-repository.js"
import { STATUS } from "@brugmann/vuemann/src/services/ajax/ajax-constants.js"

export const UserController = {
    userSearch: async (search, options) => {
        const response = options.typeSearch === 'username' 
            ? await UserRepository.userSearch({ substring: search, skip: options.skip, limit: options.limit }) 
            : await UserRepository.userSearchLastname({ substring: search, skip: options.skip, limit: options.limit })
            
        if(response.status !== STATUS.SUCCESS) { return { users: [] }}

        const users = response.data.items.map(user => userDto(user, options.groups));
        delete response.data.items
        return { users, paginator: response.data }
    },
}

import { STATUS } from "@brugmann/vuemann/src/services/ajax/ajax-constants.js"
import { req } from "@brugmann/vuemann/src/services/services-helper.js"

export const UserRepository = {
    userSearchLastname : async params => {
      return req('user.search.lastname', { params })
    },
    userSearch: async params => {
      return req("user.search", {params, 'no-flash': [STATUS.NOT_FOUND]})
    },
}

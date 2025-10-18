import { req } from "@brugmann/vuemann/src/services/services-helper.js"

export const authRepository = {
  verifyToken : async api => {
    return await req('auth.verify', { flash: false, retryRefresh: false, api })
  },
  getToken : async (username, password, api) => {
    return await req('auth.token', { username, password }, { flash: false, api })
  },
  refreshToken : async (refresh_token, api) => {
    return await req('auth.refresh', { refresh_token }, { flash: false, retryRefresh: false, api })
  },
  getUser : async (username) => {
    return await req('user.show.username', { params: { username } }, { flash: false })
  },
  getUserGroups : async (userId) => {
    return await req('user.groups', { params: { id: userId } }, { flash: false })
  }
}

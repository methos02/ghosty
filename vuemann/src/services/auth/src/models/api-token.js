import { ConfigLoader } from "@brugmann/vuemann/src/config/config-loader.js"

const setAccessToken = (api, accessToken) => {
    localStorage.setItem(api + '_token', accessToken)
}

const setTokens = (api, accessToken, refreshToken) => {
    localStorage.setItem(`${api}_token`, accessToken)
    localStorage.setItem(`${api}_refresh`, refreshToken)
}

const getRefreshToken = api => {
    return localStorage.getItem(api + '_refresh')
}

const getAccessToken = api => {
    return localStorage.getItem(`${api}_token`)
}

const removeApisTokens = () => {
  const apis = Object.entries(ConfigLoader.get('app.apis'))
  .filter(api => api[1].auth === true)
  .map(([api_name]) => api_name)

  for (const api of apis) { apiToken.removeTokens(api) }
}

const removeTokens = api => {
    localStorage.removeItem(`${api}_token`)
    localStorage.removeItem(`${api}_refresh`)
}

export const apiToken = { 
    setAccessToken, 
    setTokens,
    getRefreshToken, 
    getAccessToken, 
    removeTokens, 
    removeApisTokens
}

export const app = {
  apis: {
    ghosty: {
      url: import.meta.env[`VITE_GHOSTY_API_URL`],
      status: false,
      auth: false
    }
  }
}

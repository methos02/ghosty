export const app = {
  title: 'Ghosty',
  version: __APP_VERSION__,
  url: import.meta.env[`VITE_GHOSTY_APP_URL`],
  apis: {
    ghosty: {
      url: import.meta.env[`VITE_GHOSTY_API_URL`],
      status: false,
      auth: false,
    },
  },
}

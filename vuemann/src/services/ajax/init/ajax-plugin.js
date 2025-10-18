import axios from 'axios'
import { httpClient } from '@brugmann/vuemann/src/services/ajax/src/models/http-client.js'

export const ajaxPlugin = () => ({
  install() {
    httpClient.init(axios)
  },
})

import axios from 'axios'
import { httpClient } from '@/services/ajax/src/models/http-client.js'

export const ajaxPlugin = () => ({
  install() {
    httpClient.init(axios)
  },
})

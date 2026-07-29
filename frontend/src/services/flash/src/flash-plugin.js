import Flash from '@/services/flash/views/FlashComponent.vue'
import { h, render } from 'vue'
import { utilsH } from '@/helpers/utils-helper.js'

export const flashPlugin = () => ({
  install() {
    if (utilsH.isSsr()) {
      return
    }

    const container = document.createElement('div')
    document.body.append(container)

    const messageComponent = h(Flash)

    render(messageComponent, container)
  },
})

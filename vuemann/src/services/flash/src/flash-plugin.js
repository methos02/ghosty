import Flash from '@brugmann/vuemann/src/services/flash/views/FlashComponent.vue'
import { h, render } from 'vue'

export const flashPlugin = () => ({
  install() {
    const container = document.createElement('div')
    document.body.append(container)

    const messageComponent = h(Flash)

    render(messageComponent, container)
  },
})

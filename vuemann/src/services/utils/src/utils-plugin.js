import { h, render } from 'vue'
import DebugBarComponent from '@brugmann/vuemann/src/services/utils/views/DebugBarComponent.vue'

export const utilsPlugin = () => ({
  install() {
    const container = document.createElement('div')
    document.body.append(container)

    render(h(DebugBarComponent), container)
  },
})

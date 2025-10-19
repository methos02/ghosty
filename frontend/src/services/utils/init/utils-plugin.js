import { h, render } from 'vue'  
import DebugBarComponent from '@/services/utils/views/DebugBarComponent.vue'

export const utilsPlugin = () => ({
  install() {
    const container = document.createElement('div')
    document.body.append(container)

    const version = typeof __APP_VERSION__ === 'undefined' ? 'Unknown' : __APP_VERSION__
    const DebugBar = h(DebugBarComponent, { version })

    render(DebugBar, container)
  },
})

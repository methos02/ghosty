import { config } from '@vue/test-utils'
import { shallowRef } from 'vue'
import { matchedRouteKey } from 'vue-router'
import { createHead } from '@unhead/vue/client'
import { routerPlugin } from '@/services/router/src/router-plugin.js'

const ROUTER_LINK_STUB = {
  name: 'router-link',
  template: '<a :href="href" @click.prevent><slot /></a>',
  props: ['to'],
  computed: {
    href() {
      return typeof this.to === 'string' ? this.to : `/${this.to?.name ?? ''}`
    },
  },
}

export const configureTestUtils = () => {
  config.global.provide = {
    ...config.global.provide,
    [matchedRouteKey]: shallowRef(routerPlugin.getRouter().resolve('/').matched[0]),
  }
  config.global.plugins = [...(config.global.plugins ?? []), createHead()]
  config.global.components = {
    ...config.global.components,
    'router-link': ROUTER_LINK_STUB,
  }
}

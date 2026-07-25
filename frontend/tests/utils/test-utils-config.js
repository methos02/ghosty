import { config } from '@vue/test-utils'
import { shallowRef } from 'vue'
import { matchedRouteKey } from 'vue-router'
import { getRouter } from '@/services/router/src/router-plugin.js'

// Stub minimal de <router-link> pour les composants montés.
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

// Config globale @vue/test-utils appliquée à tous les mount() : route courante
// injectée + stub <router-link>. À appeler APRÈS le boot (getRouter() a besoin
// du router initialisé).
export const configureTestUtils = () => {
  config.global.provide = {
    ...config.global.provide,
    [matchedRouteKey]: shallowRef(getRouter().resolve('/').matched[0]),
  }
  config.global.components = {
    ...config.global.components,
    'router-link': ROUTER_LINK_STUB,
  }
}

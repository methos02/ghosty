<script setup>
import { useUtilsStore } from '@brugmann/vuemann/src/services/utils/src/utils-store.js'
import { servicesM } from '@brugmann/vuemann/src/services/services-manager.js'
import { t } from '@brugmann/vuemann/src/services/services-helper'

const utilsStore = useUtilsStore()

if (!utilsStore.errorGlobal && utilsStore.errorsGlobal.length === 0) { servicesM.service('router:push', 'home') }
</script>

<template>
  <div id="container-error" class="f-center flex-1">
    <p 
      v-if="utilsStore.errorGlobal !== undefined"
      class="h1 color-primary" 
      data-error
    >
      {{ t(utilsStore.errorGlobal) }}
    </p>
    <p
      class="h1 color-primary"
      v-for="(error, key) in utilsStore.errorsGlobal"
      data-error
      :key="key"
    >
      {{ t(error) }}
    </p>
  </div>
</template>

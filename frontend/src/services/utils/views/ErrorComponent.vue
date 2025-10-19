<script setup>
import { utilsStore } from '@/services/utils/src/utils-store.js'
import { servicesM } from '@/services/services-manager.js'
import { t } from '@/services/services-helper'

const { errorGlobal, errorsGlobal } = utilsStore.get()

if (!errorGlobal && errorsGlobal.length === 0) { servicesM.service('router:push', 'home') }
</script>

<template>
  <div id="container-error" class="f-center flex-1">
    <p
      v-if="errorGlobal !== undefined"
      class="h1 color-primary"
      data-error
    >
      {{ t(errorGlobal) }}
    </p>
    <p
      class="h1 color-primary"
      v-for="(error, key) in errorsGlobal"
      data-error
      :key="key"
    >
      {{ t(error) }}
    </p>
  </div>
</template>

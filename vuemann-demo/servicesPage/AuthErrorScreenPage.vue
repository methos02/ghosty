<script setup>
import { ref } from 'vue'
import ErrorScreenComponent from '@brugmann/vuemann/src/components/ErrorScreenComponent.vue'

const lastAction = ref('')
const action = {
  labelKey: 'auth_back_to_portal',
  callback: () => {
    lastAction.value = 'locationHelper.setHref(app.homepage_url)'
  },
}
</script>

<template>
  <div>
    <ErrorScreenComponent
      messageKey="auth_unauthorized_error:code=x00001"
      :action="action"
    />
    <p
      v-if="lastAction"
      class="text-center p-15"
    >
      action déclenchée : {{ lastAction }}
    </p>
  </div>
</template>

<script setup>
import { useWebsocketStore } from '@brugmann/vuemann/src/services/websocket/src/websocket-store.js'
import { t } from '@brugmann/vuemann/src/shortcuts/services-shortcut.js'

const { pending, secondsLeft, websocketStore } = useWebsocketStore()
</script>

<template>
  <div
    v-if="pending"
    class="resync-banner | f-column g-5"
  >
    <span>
      {{ t('ws_resync_critical', { seconds: secondsLeft }) }}
    </span>
    <div class="d-flex g-10">
      <button
        class="btn btn-sm btn-primary"
        @click="websocketStore.reloadNow()"
      >
        {{ t('ws_resync_reload_now') }}
      </button>
      <button
        class="btn btn-sm btn-ghost-primary"
        @click="websocketStore.postpone()"
      >
        {{ t('ws_resync_postpone') }}
      </button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.resync-banner {
  position: fixed;
  inset: auto auto 60px 10px;
  z-index: 20;
  max-width: 320px;
  padding: 10px 12px;
  border-radius: 4px;
  font-size: 0.85rem;
  box-shadow: 0 0 3px #444;
  border-left: 3px solid var(--danger);
  background-color: var(--danger-100);
  color: var(--danger);
}
@media print {
  .resync-banner {
    display: none !important;
  }
}
</style>

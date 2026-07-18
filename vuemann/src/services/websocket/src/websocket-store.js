import { ref } from 'vue'
import { locationHelper } from '@brugmann/vuemann/src/helpers/location-helper.js'
import { log, auth, route } from '@brugmann/vuemann/src/shortcuts/services-shortcut.js'

const RESYNC_COUNTDOWN = 30
const COUNTDOWN_INTERVAL = 1000

const state = { timer: undefined }
const pending = ref()
const secondsLeft = ref(0)

const request = (routeApiName, trigger) => {
  if (websocketStoreInternal.isReloadDisabled()) {
    return
  }
  if (pending.value) {
    return
  }

  pending.value = { routeApiName, trigger }

  log.send('resync_banner_shown', {
    routeApiName,
    trigger,
    user: auth.username(),
  })

  secondsLeft.value = RESYNC_COUNTDOWN
  websocketStoreInternal.startCountdown()
}

const postpone = () => {
  if (!pending.value) {
    return
  }

  log.send('resync_postponed', {
    routeApiName: pending.value.routeApiName,
    trigger: pending.value.trigger,
    user: auth.username(),
  })

  secondsLeft.value = RESYNC_COUNTDOWN
}

const reloadNow = () => {
  locationHelper.reload()
}

const reloadIfAllowed = () => {
  if (websocketStoreInternal.isReloadDisabled()) {
    return
  }
  websocketStore.reloadNow()
}

const dismiss = () => {
  websocketStoreInternal.stopCountdown()
  pending.value = undefined
}

export const websocketStore = {
  request,
  postpone,
  reloadNow,
  reloadIfAllowed,
  dismiss,
}

const isReloadDisabled = () => {
  return route.current()?.meta?.ws?.reload === false
}

const startCountdown = () => {
  websocketStoreInternal.stopCountdown()
  state.timer = setInterval(websocketStoreInternal.tick, COUNTDOWN_INTERVAL)
}

const tick = () => {
  secondsLeft.value -= 1
  if (secondsLeft.value > 0) {
    return
  }

  websocketStoreInternal.stopCountdown()
  websocketStore.reloadNow()
}

const stopCountdown = () => {
  if (state.timer === undefined) {
    return
  }
  clearInterval(state.timer)
  state.timer = undefined
}

export const websocketStoreInternal = {
  isReloadDisabled,
  startCountdown,
  tick,
  stopCountdown,
}

export const useWebsocketStore = () => ({
  pending,
  secondsLeft,
  websocketStore,
})

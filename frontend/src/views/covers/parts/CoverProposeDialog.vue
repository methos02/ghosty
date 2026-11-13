<script setup>
import { computed, ref } from 'vue'
import { flash, route, t } from '@/services/shortcuts/services-shortcut.js'
import DialogComponent from '@/components/DialogComponent.vue'
import LoaderComponent from '@/components/LoaderComponent.vue'
import ErrorFormComponent from '@/services/form/views/ErrorFormComponent.vue'
import CoverImageField from '@/views/covers/parts/CoverImageField.vue'
import { CoverController } from '@/apis/covers/controllers/cover-controller.js'
import { validateCoverForm } from '@/apis/covers/formRequest/cover-form-request.js'
import { useCoverStore } from '@/core-vue/stores/covers/cover-store.js'
import { COVER_GUARD_STATUSES } from '@/constants/cover-constants.js'
import { ajaxHelper } from '@/core/helpers/ajax-helper.js'

const currentRoute = route.current()
const { covers, myCoverId, coverStore } = useCoverStore()

const dialog = ref()
const sendButton = ref()
const datas = ref({})
const refusal = ref('')

const myCover = computed(() => covers.value.find(cover => cover.id === myCoverId.value))

const sendCover = async () => {
  if (myCover.value) {
    return await CoverController.replaceImage(myCover.value.id, datas.value)
  }

  return await CoverController.create(currentRoute.value.params.slug, datas.value)
}

const storeCover = response => {
  coverStore.setOfficialCoverId(response.officialCoverId)

  if (myCover.value) {
    coverStore.replaceCovers([response.cover])
    flash.successT('cover_propose_dialog.replaced')
    return
  }

  coverStore.addCover(response.cover)
  flash.successT('cover_propose_dialog.proposed')
}

const send = async () => {
  refusal.value = ''

  const validation = validateCoverForm(datas.value)
  if (!validation.valid) {
    return
  }

  const response = await sendCover()

  if (COVER_GUARD_STATUSES.includes(response.status)) {
    refusal.value = response.data.message
    return
  }

  if (!ajaxHelper.isSuccess(response.status)) {
    return
  }

  storeCover(response)
  dialog.value.close()
}

const cleanup = () => {
  datas.value = {}
  refusal.value = ''
}

const show = () => {
  dialog.value.show()
}

defineExpose({ show })
</script>

<template>
  <DialogComponent
    ref="dialog"
    @dialog-close="cleanup"
  >
    <template #title>
      <template v-if="myCover">{{ t('cover_propose_dialog.title_replace') }}</template>
      <template v-else>{{ t('cover_propose_dialog.title_propose') }}</template>
    </template>

    <form
      class="cover-propose-dialog | d-flex f-column g-15"
      @submit.prevent="sendButton?.runCallback()"
    >
      <p
        v-if="myCover"
        class="cover-propose-dialog__warning | bg-warning-100 p-10 radius-5"
      >
        {{ t('cover_propose_dialog.replace_warning', myCover.likeCount) }}
      </p>

      <p class="cover-propose-dialog__rules | fs-300 color-neutral-700">
        {{ t('cover_propose_dialog.rules') }}
      </p>

      <CoverImageField v-model="datas.image" />
      <ErrorFormComponent name="cover.image" />

      <p
        v-if="refusal !== ''"
        class="cover-propose-dialog__refusal | bg-danger-100 p-10 radius-5 color-danger"
      >
        {{ refusal }}
      </p>

      <LoaderComponent
        ref="sendButton"
        :cb="send"
        buttonType="submit"
        buttonClasses="cover-propose-dialog__send | btn btn-primary"
      >
        <template v-if="myCover">{{ t('cover_propose_dialog.send_replace') }}</template>
        <template v-else>{{ t('cover_propose_dialog.send_propose') }}</template>
      </LoaderComponent>
    </form>
  </DialogComponent>
</template>

<style lang="scss" scoped>
.cover-propose-dialog {
  width: 100vw;
  max-width: 480px;
}
</style>

<script setup>
import { flash, router, t } from '@/services/shortcuts/services-shortcut.js'
import ConfirmButtonComponent from '@/components/ConfirmButtonComponent.vue'
import { ModerationController } from '@/apis/moderation/controllers/moderation-controller.js'
import { REPORTED_CONTENT_TYPES } from '@/constants/moderation-constants.js'
import { ajaxHelper } from '@/core/helpers/ajax-helper.js'

const props = defineProps({
  contentType: { type: String, required: true },
  contentId: { type: Number, required: true },
})

const sendRestore = () => {
  if (props.contentType === REPORTED_CONTENT_TYPES.CHAPTER) {
    return ModerationController.restoreChapter(props.contentId)
  }

  if (props.contentType === REPORTED_CONTENT_TYPES.COVER) {
    return ModerationController.restoreCover(props.contentId)
  }

  return ModerationController.restoreComment(props.contentId)
}

const restore = async () => {
  const response = await sendRestore()
  if (!ajaxHelper.isSuccess(response.status)) {
    return
  }

  flash.successT('moderation_restore_button.restored')
  await router.push({ name: 'moderation' })
}
</script>

<template>
  <ConfirmButtonComponent
    :cb="restore"
    :question="t('moderation_restore_button.confirm')"
    buttonClasses="moderation-restore-button | btn btn-primary-alt"
  >
    {{ t('moderation_restore_button.restore') }}
  </ConfirmButtonComponent>
</template>

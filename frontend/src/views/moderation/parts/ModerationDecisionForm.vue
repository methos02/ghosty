<script setup>
import { computed, ref, watch } from 'vue'
import { flash, router, t } from '@/services/shortcuts/services-shortcut.js'
import ConfirmButtonComponent from '@/components/ConfirmButtonComponent.vue'
import ErrorFormComponent from '@/services/form/views/ErrorFormComponent.vue'
import SelectComponent from '@/services/form/views/inputs/SelectComponent.vue'
import TextareaComponent from '@/services/form/views/inputs/TextareaComponent.vue'
import { ConfigLoader } from '@/config/config-loader.js'
import { ModerationController } from '@/apis/moderation/controllers/moderation-controller.js'
import { validateModerationForm } from '@/apis/moderation/formRequest/moderation-form-request.js'
import {
  REPORTED_CONTENT_TYPES,
  RESOLUTIONS,
  SANCTION_TYPES,
} from '@/constants/moderation-constants.js'
import { ajaxHelper } from '@/core/helpers/ajax-helper.js'

const props = defineProps({
  contentType: { type: String, required: true },
  contentId: { type: Number, required: true },
  resolutions: { type: Array, required: true },
})

const resolution = defineModel('resolution', { type: String, default: undefined })
const contentAfterRemoval = defineModel('contentAfterRemoval', { type: String, default: '' })

const SANCTIONED_WHEN_HIDDEN = new Set([
  REPORTED_CONTENT_TYPES.COMMENT,
  REPORTED_CONTENT_TYPES.COVER,
])

const formData = ref({
  sanction: {},
})

const isSanctionRequired = computed(
  () => SANCTIONED_WHEN_HIDDEN.has(props.contentType) && resolution.value === RESOLUTIONS.HIDDEN,
)

const decision = () => {
  return {
    ...formData.value,
    resolution: resolution.value,
    content: contentAfterRemoval.value,
    isSanctionRequired: isSanctionRequired.value,
  }
}

const suggestWarning = isRequired => {
  if (!isRequired || formData.value.sanction.type !== undefined) {
    return
  }

  formData.value.sanction = {
    ...formData.value.sanction,
    type: SANCTION_TYPES.WARNING,
  }
}

watch(isSanctionRequired, suggestWarning)

const isBan = computed(() => {
  const sanctionType = formData.value.sanction.type

  return sanctionType !== undefined && sanctionType !== SANCTION_TYPES.WARNING
})

const sendDecision = () => {
  if (props.contentType === REPORTED_CONTENT_TYPES.CHAPTER) {
    return ModerationController.moderateChapter(props.contentId, decision())
  }

  if (props.contentType === REPORTED_CONTENT_TYPES.COVER) {
    return ModerationController.moderateCover(props.contentId, decision())
  }

  return ModerationController.moderateComment(props.contentId, decision())
}

const decide = async () => {
  const validation = validateModerationForm(decision())
  if (!validation.valid) {
    return
  }

  const response = await sendDecision()
  if (!ajaxHelper.isSuccess(response.status)) {
    return
  }

  flash.successT('moderation_decision.decided')
  await router.push({ name: 'moderation' })
}
</script>

<template>
  <form
    class="moderation-decision | d-flex f-column g-20"
    @submit.prevent
  >
    <fieldset class="moderation-decision__resolutions | d-flex f-column g-10">
      <legend class="fs-500 fw-700 mb-10">{{ t('moderation_decision.resolution') }}</legend>

      <label
        v-for="choice in resolutions"
        :key="choice"
        class="moderation-decision__resolution | d-flex g-10 a-start pointer"
      >
        <input
          v-model="resolution"
          type="radio"
          name="resolution"
          :value="choice"
        />
        <span class="d-flex f-column">
          <span class="fw-500">{{ t(`moderation.resolutions.${choice}`) }}</span>
          <span class="fs-300 color-neutral-700">
            {{ t(`moderation_decision.resolution_help.${choice}`) }}
          </span>
        </span>
      </label>

      <ErrorFormComponent name="moderation.resolution" />
    </fieldset>

    <fieldset class="moderation-decision__sanction | d-flex f-column g-15">
      <legend class="fs-500 fw-700 mb-10">{{ t('moderation_decision.sanction') }}</legend>

      <SelectComponent
        v-model="formData.sanction.type"
        name="sanction.type"
        :label="t('moderation_decision.sanction_type')"
        :fixedLabel="true"
        form="moderation"
      >
        <option
          v-if="!isSanctionRequired"
          :value="undefined"
        >
          {{ t('moderation_decision.sanction_none') }}
        </option>
        <option
          v-for="sanctionType in SANCTION_TYPES"
          :key="sanctionType"
          :value="sanctionType"
        >
          {{ t(`moderation.sanction_types.${sanctionType}`) }}
        </option>
      </SelectComponent>

      <SelectComponent
        v-if="isBan"
        v-model="formData.sanction.days"
        name="sanction.days"
        :label="t('moderation_decision.sanction_duration')"
        :fixedLabel="true"
        form="moderation"
      >
        <option :value="undefined">{{ t('moderation_decision.sanction_permanent') }}</option>
        <option
          v-for="days in ConfigLoader.get('moderation.sanctionDays')"
          :key="days"
          :value="days"
        >
          {{ t('moderation_decision.sanction_days', days) }}
        </option>
      </SelectComponent>

      <TextareaComponent
        v-if="formData.sanction.type !== undefined"
        v-model="formData.sanction.reason"
        name="sanction.reason"
        :label="t('moderation_decision.sanction_reason')"
        :required="true"
        :maxLength="ConfigLoader.get('moderation.reasonMaxLength')"
        :autogrow="true"
        form="moderation"
      />
    </fieldset>

    <ConfirmButtonComponent
      :cb="decide"
      :question="t('moderation_decision.confirm')"
      buttonClasses="moderation-decision__submit | btn btn-primary"
    >
      {{ t('moderation_decision.submit') }}
    </ConfirmButtonComponent>
  </form>
</template>

<style lang="scss" scoped>
.moderation-decision {
  &__resolutions,
  &__sanction {
    border: none;
    padding: 0;
    margin: 0;
  }
}
</style>

<script setup>
import { computed, ref } from 'vue'
import ConfirmButton from '@/components/ConfirmButtonComponent.vue'
import { correctionHelper } from '@/core/helpers/correction-helper.js'
import { t } from '@/services/shortcuts/services-shortcut.js'

const props = defineProps({
  cb: { type: Function, required: true },
  content: { type: String, default: '' },
  buttonClasses: { type: String, default: 'btn btn-primary' },
})

const confirmButton = ref()

const allowance = computed(() => correctionHelper.allowanceFor(props.content))

const ask = () => {
  confirmButton.value?.ask()
}

defineExpose({ ask })
</script>

<template>
  <ConfirmButton
    ref="confirmButton"
    :cb="props.cb"
    :title="t('publish_button.title')"
    :buttonClasses="props.buttonClasses"
  >
    <slot></slot>
    <template #details>
      <div class="publish-button__terms | d-flex f-column g-5">
        <p class="fw-700">{{ t('publish_button.after') }}</p>
        <ul class="list | pl-20">
          <li>{{ t('publish_button.corrections') }}</li>
          <li>{{ t('publish_button.delay') }}</li>
          <li class="publish-button__max-words">
            {{ t('publish_button.max_words', { allowance }) }}
          </li>
        </ul>
      </div>
    </template>
  </ConfirmButton>
</template>

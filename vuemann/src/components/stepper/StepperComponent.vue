<script setup>
import { ref, computed, readonly, watch, nextTick, onMounted, toRaw } from 'vue'
import { t, log } from '@brugmann/vuemann/src/shortcuts/services-shortcut.js'
import DialogComponent from '@brugmann/vuemann/src/components/DialogComponent.vue'
import { useStepperKeyboardNavigation } from '@brugmann/vuemann/src/components/stepper/use-stepper-keyboard-navigation.js'

const props = defineProps({
  steps: { type: Array, required: true },
  title: { type: String, default: '' },
  onSubmit: { type: Function, required: true },
  onCancel: { type: Function, default: undefined },
  defaultForm: { type: Object, default: () => ({}) },
})

const model = defineModel({ type: Object, required: true })

const currentStep = ref(0)
const isSubmitting = ref(false)
const confirmDialog = ref()
const stepContentContainer = ref()
const nextButton = ref()
const submitButton = ref()

const canGoNext = computed(() => currentStep.value < props.steps.length - 1)
const canGoPrevious = computed(() => currentStep.value > 0)
const isLastStep = computed(() => currentStep.value === props.steps.length - 1)
const areButtonsDisabled = computed(() => isSubmitting.value)

const buildStepClass = stepIndex => {
  const stepClass = []

  if (stepIndex > 0) {
    stepClass.push('stepper__step-container--with-line')
  }

  const stateClass =
    currentStep.value >= stepIndex
      ? 'stepper__step-container--colored'
      : 'stepper__step-container--neutral'
  stepClass.push(stateClass)

  if (stepIndex < currentStep.value) {
    stepClass.push('stepper__step-container--clickable')
  }

  return stepClass.join(' ')
}

const handleStepClick = stepIndex => {
  if (stepIndex >= currentStep.value) {
    return
  }

  currentStep.value = stepIndex
}

const validateCurrentStep = () => {
  const currentStepData = props.steps[currentStep.value]
  if (!currentStepData.validation) {
    return true
  }

  const validation = currentStepData.validation(model.value)
  return validation.valid
}

const goToNextStep = () => {
  if (!canGoNext.value) {
    return
  }
  if (!validateCurrentStep()) {
    return
  }

  const currentStepData = props.steps[currentStep.value]
  if (currentStepData.onLeave) {
    currentStepData.onLeave(model.value)
  }

  currentStep.value++
}

const goToPreviousStep = () => {
  if (!canGoPrevious.value) {
    return
  }

  currentStep.value--
}

const goToStep = stepIndex => {
  if (stepIndex < 0) {
    return
  }
  if (stepIndex >= props.steps.length) {
    return
  }

  currentStep.value = stepIndex
}

const reset = () => {
  model.value = structuredClone(toRaw(props.defaultForm))
  currentStep.value = 0
}

const handleCancelClick = () => {
  confirmDialog.value.show()
}

const handleConfirmCancel = () => {
  confirmDialog.value.close()
  if (props.onCancel) {
    props.onCancel()
    return
  }
  reset()
}

const handleSubmit = async () => {
  if (!validateCurrentStep()) {
    return
  }

  isSubmitting.value = true
  try {
    await props.onSubmit()
  } catch (error) {
    log.error('Submit failed:', error)
  } finally {
    isSubmitting.value = false
  }
}

const { startListening, stopListening, focusFirstElement } = useStepperKeyboardNavigation({
  container: stepContentContainer,
  nextButton,
  submitButton,
  isLastStep,
  goToNextStep,
  handleSubmit,
})

onMounted(() => {
  startListening()
})

watch(currentStep, () => {
  stopListening()
  nextTick(() => {
    startListening()
    focusFirstElement()
  })
})

defineExpose({
  goToStep,
  reset,
  currentStep: readonly(currentStep),
})
</script>

<template>
  <div class="stepper">
    <div class="stepper__header">
      <h1
        v-if="title"
        class="h2 text-center mb-15"
      >
        {{ title }}
      </h1>
      <div class="stepper__steps-container">
        <div
          v-for="(step, index) in steps"
          :key="step.key"
          class="stepper__step-container"
          :class="buildStepClass(index)"
        >
          <div
            class="stepper__step-wrapper"
            @click="handleStepClick(index)"
          >
            <div class="stepper__step">
              <div class="stepper__step-circle">
                <i :class="step.icon || 'fa-solid fa-circle'"></i>
              </div>
            </div>
            <p class="stepper__step-label">
              {{ step.label }}
            </p>
          </div>
        </div>
      </div>
    </div>
    <div class="stepper__content">
      <div
        ref="stepContentContainer"
        class="stepper__card"
      >
        <component
          :is="steps[currentStep].component"
          v-model="model"
          @go-to-step="goToStep"
        />

        <div class="stepper__actions">
          <button
            class="btn btn-secondary"
            :disabled="areButtonsDisabled"
            tabindex="-1"
            @click="handleCancelClick"
          >
            {{ t('common.cancel') }}
          </button>

          <div class="stepper__actions-right">
            <button
              v-if="canGoPrevious"
              class="btn btn-secondary"
              :disabled="areButtonsDisabled"
              tabindex="-1"
              @click="goToPreviousStep"
            >
              {{ t('common.previous') }}
            </button>

            <button
              v-if="canGoNext && !isLastStep"
              ref="nextButton"
              class="btn btn-primary btn-primary-400-active"
              :disabled="areButtonsDisabled"
              @click="goToNextStep"
            >
              {{ t('common.next') }}
            </button>

            <button
              v-if="isLastStep"
              ref="submitButton"
              class="btn btn-primary btn-primary-400-active"
              :disabled="areButtonsDisabled"
              @click="handleSubmit"
            >
              {{ t('common.submit') }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <DialogComponent
      ref="confirmDialog"
      :title="t('common.confirm_cancel')"
    >
      <slot name="confirm-dialog">
        <p class="mb-15">{{ t('stepper.confirm_cancel_message') }}</p>
        <div class="d-flex g-10 j-end">
          <button
            class="btn btn-secondary"
            @click="confirmDialog.close()"
          >
            {{ t('common.no') }}
          </button>
          <button
            class="btn btn-primary btn-primary-400-active"
            @click="handleConfirmCancel"
          >
            {{ t('common.yes') }}
          </button>
        </div>
      </slot>
    </DialogComponent>
  </div>
</template>

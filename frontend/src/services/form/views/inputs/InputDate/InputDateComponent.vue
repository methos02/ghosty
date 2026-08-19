<script setup>
import { ref, onMounted, onUnmounted, watch, nextTick } from 'vue'
import ErrorForm from '@/services/form/views/ErrorFormComponent.vue'
import CalendarPopup from '@/services/form/views/inputs/InputDate/CalendarPopupComponent.vue'
import { FormHelper } from '@/core/helpers/form-helper.js'
import { flash, t } from '@/services/shortcuts/services-shortcut.js'
import { formStore } from '@/services/form/src/form-store.js'
import { dateHelper } from '@/core/helpers/date-helper.js'
import { InputDate } from '@/services/form/views/inputs/InputDate/src/input-date.js'
import '@/services/form/views/inputs/InputDate/src/input-date.scss'

const props = defineProps({
  name: { type: String, required: true },
  label: { type: String, required: true },
  required: { type: Boolean, default: false },
  error: { type: Boolean, default: true },
  form: { type: String, default: undefined },
  containerClass: { type: String, default: '' },
  dateFormat: { type: String, default: 'DD/MM/YYYY' },
  minDate: { type: String, default: undefined },
  maxDate: { type: String, default: undefined },
  hasFooter: { type: Boolean, default: true },
  initialViewDate: { type: String, default: undefined },
})

const input = defineModel({ type: String, default: undefined })

const showCalendar = ref(false)
const inputReference = ref()
const selectedDate = ref()
const isInputFocused = ref(false)
const displayValue = ref('')
const verticalPosition = ref('bottom')
const horizontalPosition = ref('left')
const calendarReference = ref()

const computeCalendarPosition = () => {
  if (!inputReference.value || !calendarReference.value?.$el) {
    return
  }
  const inputRect = inputReference.value.getBoundingClientRect()
  const calendarElement = calendarReference.value.$el
  const spaceBelow = window.innerHeight - inputRect.bottom
  const spaceRight = window.innerWidth - inputRect.left
  verticalPosition.value = spaceBelow < calendarElement.offsetHeight ? 'top' : 'bottom'
  horizontalPosition.value = spaceRight < calendarElement.offsetWidth ? 'right' : 'left'
}

watch(showCalendar, async isOpen => {
  if (!isOpen) {
    verticalPosition.value = 'bottom'
    horizontalPosition.value = 'left'
    return
  }
  await nextTick()
  computeCalendarPosition()
})

const toggleCalendar = state => {
  const newState = state === undefined ? !showCalendar.value : state

  showCalendar.value = newState
  if (!newState) {
    return
  }

  nextTick(() => {
    inputReference.value?.querySelector(':scope input')?.focus()
  })
}

const selectDate = date => {
  selectedDate.value = date
  input.value = dateHelper.formatDateLocal(date, props.dateFormat)
  displayValue.value = dateHelper.formatDateLocal(date, 'DD/MM/YYYY')
  showCalendar.value = false
}

const clearDate = () => {
  selectedDate.value = undefined
  input.value = undefined
  displayValue.value = ''
  showCalendar.value = false
}

const DATE_LENGTH = 10
const handleInput = event => {
  const inputElement = event.target
  const cursorPosition = inputElement.selectionStart
  const previousLength = inputElement.value.length

  displayValue.value = InputDate.formatInputValue(inputElement.value)

  nextTick(() => {
    const newPosition = cursorPosition + (displayValue.value.length - previousLength)
    inputElement.setSelectionRange(newPosition, newPosition)
  })

  if (!displayValue.value) {
    input.value = undefined
    selectedDate.value = undefined
    return
  }

  if (
    displayValue.value.length !== DATE_LENGTH ||
    !dateHelper.isValidDate(displayValue.value, 'DD/MM/YYYY')
  ) {
    return
  }

  const date = new Date(dateHelper.parseDateLocal(displayValue.value, 'DD/MM/YYYY'))
  input.value = dateHelper.formatDateLocal(date, props.dateFormat)
  selectedDate.value = date
}

const handleFocus = () => {
  isInputFocused.value = true
}

const handleBlur = () => {
  isInputFocused.value = false
  showCalendar.value = false

  if (!displayValue.value) {
    return
  }
  if (
    displayValue.value.length === DATE_LENGTH &&
    dateHelper.isValidDate(displayValue.value, 'DD/MM/YYYY')
  ) {
    return
  }

  const inputName = FormHelper.getInputName(props.name, props.form)
  formStore.addError(inputName, `input_date.errors.invalid_date`)
  displayValue.value = ''
  input.value = undefined
  selectedDate.value = undefined
}

const handleKeydown = event => {
  if (InputDate.isAllowedKey(event)) {
    return
  }
  event.preventDefault()
}

const handleEnterKey = event => {
  if (!showCalendar.value) {
    return
  }

  event.preventDefault()

  if (displayValue.value.length !== DATE_LENGTH) {
    return
  }
  if (!dateHelper.isValidDate(displayValue.value, 'DD/MM/YYYY')) {
    return
  }

  showCalendar.value = false
}

const handleClickOutside = event => {
  if (!inputReference.value?.contains(event.target)) {
    showCalendar.value = false
  }
}

watch(input, newValue => {
  if (!newValue) {
    displayValue.value = ''
    selectedDate.value = undefined
    return
  }
  changeDisplayValue(newValue)
})

onMounted(() => {
  document.addEventListener('click', handleClickOutside, { capture: true })

  if (!input.value) {
    return
  }
  changeDisplayValue(input.value)
})

const changeDisplayValue = value => {
  if (!dateHelper.isValidDate(value, props.dateFormat)) {
    input.value = undefined
    flash.error(t(`input_date.errors.invalid_date`))
    return
  }

  selectedDate.value = new Date(dateHelper.parseDateLocal(value, props.dateFormat))
  displayValue.value = dateHelper.formatDateLocal(selectedDate.value, 'DD/MM/YYYY')
}

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside, true)
})

defineExpose({ toggleCalendar })
</script>

<template>
  <div
    class="input-date-component | p-relative"
    :class="props.containerClass"
  >
    <div
      class="p-relative"
      ref="inputReference"
      @click="toggleCalendar(true)"
    >
      <input
        :id="FormHelper.getInputName(name, form)"
        :name="FormHelper.getInputName(name, form)"
        type="text"
        class="form-input input"
        :value="displayValue"
        @input="handleInput"
        @focus="handleFocus"
        @blur="handleBlur"
        @keydown="handleKeydown"
        @keydown.enter="handleEnterKey"
        :placeholder="isInputFocused ? t(`input_date.placeholder`) : ''"
        maxlength="10"
        autocomplete="off"
      />

      <label
        class="form-label"
        :class="{ required: props.required }"
        :for="FormHelper.getInputName(name, form)"
      >
        {{ label }}
      </label>

      <button
        class="input-button calendar-button | f-center"
        type="button"
        tabindex="-1"
        :title="t(`input_date.calendar_title`)"
      >
        <i class="fa-solid fa-calendar mx-15"></i>
      </button>

      <CalendarPopup
        v-if="showCalendar"
        ref="calendarReference"
        :selectedDate="selectedDate"
        :minDate="props.minDate"
        :maxDate="props.maxDate"
        :hasFooter="props.hasFooter"
        :verticalPosition="verticalPosition"
        :horizontalPosition="horizontalPosition"
        :initialViewDate="props.initialViewDate"
        @select-date="selectDate"
        @clear-date="clearDate"
      />
    </div>

    <ErrorForm
      v-if="error !== false"
      :name="FormHelper.getInputName(name, form)"
    />
  </div>
</template>

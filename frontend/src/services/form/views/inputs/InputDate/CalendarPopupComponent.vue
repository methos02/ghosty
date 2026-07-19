<script setup>
import { ref, computed, watch } from 'vue'
import { t } from '@/services/shortcuts/services-shortcut.js'
import { dateHelper } from '@/helpers/date-helper.js'
import { InputDate } from '@/services/form/views/inputs/InputDate/src/input-date.js'

const props = defineProps({
  selectedDate: { type: Date, default: undefined },
  minDate: { type: String, default: undefined },
  maxDate: { type: String, default: undefined },
  hasFooter: { type: Boolean, default: true },
  verticalPosition: { type: String, default: 'bottom' },
  horizontalPosition: { type: String, default: 'left' },
  initialViewDate: {
    type: String,
    default: undefined,
    validator: value => dateHelper.isValidDate(value, 'YYYY-MM-DD'),
  },
})

const emit = defineEmits(['select-date', 'clear-date'])

const resolveInitialDate = () => {
  if (props.selectedDate) {
    return new Date(props.selectedDate)
  }

  if (props.initialViewDate) {
    return new Date(dateHelper.parseDateLocal(props.initialViewDate, 'YYYY-MM-DD'))
  }

  return new Date()
}
const currentDate = ref(resolveInitialDate())

const currentMonth = computed(() => currentDate.value.getMonth())
const currentYear = computed(() => currentDate.value.getFullYear())
const monthName = computed(() => InputDate.getMonthName(currentMonth.value))
const calendarDays = computed(() =>
  InputDate.generateCalendarDays(currentYear.value, currentMonth.value),
)

const weekDays = [
  t(`input_date.weekdays.monday`),
  t(`input_date.weekdays.tuesday`),
  t(`input_date.weekdays.wednesday`),
  t(`input_date.weekdays.thursday`),
  t(`input_date.weekdays.friday`),
  t(`input_date.weekdays.saturday`),
  t(`input_date.weekdays.sunday`),
]

const navigateMonth = direction => {
  const newDate = new Date(currentDate.value)
  newDate.setMonth(newDate.getMonth() + direction)
  currentDate.value = newDate
}

const selectDate = date => {
  if (InputDate.isDateDisabled(date, props.minDate, props.maxDate)) {
    return
  }
  emit('select-date', date)
}

const isTodayDisabled = computed(() =>
  InputDate.isDateDisabled(new Date(), props.minDate, props.maxDate),
)

watch(
  () => props.selectedDate,
  newDate => {
    if (!newDate) {
      return
    }
    currentDate.value = new Date(newDate)
  },
  { immediate: true },
)
</script>

<template>
  <div
    class="calendar-popup"
    :class="[verticalPosition, horizontalPosition]"
    @mousedown.prevent
    @click.stop
  >
    <div class="calendar-header">
      <button
        type="button"
        tabindex="-1"
        @click="navigateMonth(-1)"
        class="nav-button"
      >
        <i class="fa-solid fa-chevron-left"></i>
      </button>
      <h3 class="calendar-title">{{ monthName }} {{ currentYear }}</h3>
      <button
        type="button"
        tabindex="-1"
        @click="navigateMonth(1)"
        class="nav-button"
      >
        <i class="fa-solid fa-chevron-right"></i>
      </button>
    </div>

    <div class="calendar-weekdays">
      <div
        v-for="day in weekDays"
        :key="day"
        class="weekday"
      >
        {{ day }}
      </div>
    </div>

    <div class="calendar-grid">
      <button
        v-for="day in calendarDays"
        :key="day.date.getTime()"
        type="button"
        tabindex="-1"
        class="calendar-day"
        :class="{
          'other-month': !day.isCurrentMonth,
          today: day.isToday,
          selected: selectedDate && day.date.toDateString() === selectedDate.toDateString(),
          disabled: InputDate.isDateDisabled(day.date, props.minDate, props.maxDate),
        }"
        :disabled="InputDate.isDateDisabled(day.date, props.minDate, props.maxDate)"
        @click="selectDate(day.date)"
      >
        {{ day.date.getDate() }}
      </button>
    </div>

    <div
      v-if="hasFooter"
      class="calendar-footer"
    >
      <slot>
        <button
          v-if="!isTodayDisabled"
          type="button"
          tabindex="-1"
          @click="selectDate(new Date())"
          class="today-button"
        >
          {{ t(`input_date.buttons.today`) }}
        </button>
        <button
          type="button"
          tabindex="-1"
          @click="emit('clear-date')"
          class="clear-button"
        >
          {{ t(`input_date.buttons.clear`) }}
        </button>
      </slot>
    </div>
  </div>
</template>

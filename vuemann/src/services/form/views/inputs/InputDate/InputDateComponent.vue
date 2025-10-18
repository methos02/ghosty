<script setup>
import { ref, computed, onMounted, onUnmounted, watch, nextTick } from 'vue'
import ErrorForm from "@brugmann/vuemann/src/services/form/views/ErrorFormComponent.vue"
import { FormHelper } from "@brugmann/vuemann/src/services/form/form-helper.js"
import { flash, t } from "@brugmann/vuemann/src/services/services-helper.js"
import { dateHelper } from "@brugmann/vuemann/src/helpers/date-helper.js"
import { InputDate } from "./src/input-date.js"
import "./src/input-date.scss"

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
    hasFooter: { type: Boolean, default: true }
})

const input = defineModel({type: String, default: ''})

const showCalendar = ref(false)
const inputReference = ref()    
const calendarReference = ref()
const currentDate = ref(new Date())
const selectedDate = ref()
const isInputFocused = ref(false)
const displayValue = ref('')

const weekDays = [
    t(`input_date.weekdays.monday`),
    t(`input_date.weekdays.tuesday`),
    t(`input_date.weekdays.wednesday`),
    t(`input_date.weekdays.thursday`),
    t(`input_date.weekdays.friday`),
    t(`input_date.weekdays.saturday`),
    t(`input_date.weekdays.sunday`)
]

const currentMonth = computed(() => currentDate.value.getMonth())
const currentYear = computed(() => currentDate.value.getFullYear())
const monthName = computed(() => InputDate.getMonthName(currentMonth.value))
const calendarDays = computed(() => InputDate.generateCalendarDays(currentYear.value, currentMonth.value))

const toggleCalendar = (state) => {
    const newState = state === undefined ? !showCalendar.value : state
    
    showCalendar.value = newState
    if(!newState) { return }
    
    if (selectedDate.value) { currentDate.value = new Date(selectedDate.value) }
    
    nextTick(() => {
        inputReference.value?.querySelector('input')?.focus()
    })
}

const selectDate = (date) => {
    if (InputDate.isDateDisabled(date, props.minDate, props.maxDate)) { return }
    
    selectedDate.value = date
    input.value = dateHelper.formatDate(date, props.dateFormat)
    displayValue.value = dateHelper.formatDate(date, 'DD/MM/YYYY')
    showCalendar.value = false
}

const navigateMonth = (direction) => {
    const newDate = new Date(currentDate.value)
    newDate.setMonth(newDate.getMonth() + direction)
    currentDate.value = newDate
}

const goToToday = () => {
    selectDate(new Date())
}

const clearDate = () => {
    selectedDate.value = undefined
    input.value = ''
    displayValue.value = ''
    showCalendar.value = false
}

const DATE_LENGTH = 10
const handleInput = (event) => {
    displayValue.value = InputDate.formatInputValue(event.target.value)
    if (displayValue.value.length !== DATE_LENGTH || !dateHelper.isValidDate(displayValue.value, 'DD/MM/YYYY')) { 
        input.value = ''
        selectedDate.value = undefined
        return
    }

    const date = new Date(dateHelper.parseDate(displayValue.value, 'DD/MM/YYYY'))
    input.value = dateHelper.formatDate(date, props.dateFormat)
    selectedDate.value = date   
}

const handleFocus = () => {
    isInputFocused.value = true
}

const handleBlur = () => {
    isInputFocused.value = false
}

const handleClickOutside = (event) => {
    if (inputReference.value && !inputReference.value.contains(event.target) && 
        calendarReference.value && !calendarReference.value.contains(event.target)) {
        showCalendar.value = false
    }
}

watch(selectedDate, (newDate) => {
    if (newDate && showCalendar.value) {
        currentDate.value = new Date(newDate)
    }
})

watch(input, (newValue) => {
    if (!newValue) { 
        displayValue.value = ''
        selectedDate.value = undefined
        return 
    }
    changeDisplayValue(newValue)
})

onMounted(() => {
    document.addEventListener('click', handleClickOutside, true)

    if (!input.value) { return }
    changeDisplayValue(input.value)
})

const changeDisplayValue = (value) => {
    if (!dateHelper.isValidDate(value, props.dateFormat)) {
        input.value = ''
        flash.error(t(`input_date.errors.invalid_date`))
        return
    }

    selectedDate.value = new Date(dateHelper.parseDate(value, props.dateFormat))
    displayValue.value = dateHelper.formatDate(selectedDate.value, 'DD/MM/YYYY')
}

onUnmounted(() => {
    document.removeEventListener('click', handleClickOutside, true)
})

defineExpose({ toggleCalendar })
</script>

<template>
    <div class="input-date-component | p-relative" :class="props.containerClass">
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
                :placeholder="isInputFocused ? t(`input_date.placeholder`) : ''"
                maxlength="10"
            />
            
            <label 
                class="form-label"
                :class="{'required': props.required}"
                :for="FormHelper.getInputName(name, form)"
            >
                {{ label }}
            </label>
            
            <button 
                class="input-button calendar-button | f-center"
                type="button"
                :title="t(`input_date.calendar_title`)"
            >
                <i class="fa-solid fa-calendar mx-15"></i>
            </button>
        </div>

        <div 
            v-if="showCalendar" 
            class="calendar-popup"
            ref="calendarReference"
            @click.stop
        >
            <div class="calendar-header">
                <button type="button" @click="navigateMonth(-1)" class="nav-button">
                    <i class="fa-solid fa-chevron-left"></i>
                </button>
                <h3 class="calendar-title">
                    {{ monthName }} {{ currentYear }}
                </h3>
                <button type="button" @click="navigateMonth(1)" class="nav-button">
                    <i class="fa-solid fa-chevron-right"></i>
                </button>
            </div>

            <div class="calendar-weekdays">
                <div v-for="day in weekDays" :key="day" class="weekday">
                    {{ day }}
                </div>
            </div>

            <div class="calendar-grid">
                <button
                    v-for="day in calendarDays"
                    :key="day.date.getTime()"
                    type="button"
                    class="calendar-day"
                    :class="{
                        'other-month': !day.isCurrentMonth,
                        'today': day.isToday,
                        'selected': selectedDate && day.date.toDateString() === selectedDate.toDateString(),
                        'disabled': InputDate.isDateDisabled(day.date, props.minDate, props.maxDate)
                    }"
                    :disabled="InputDate.isDateDisabled(day.date, props.minDate, props.maxDate)"
                    @click="selectDate(day.date)"
                >
                    {{ day.date.getDate() }}
                </button>
            </div>

            <div 
            v-if="hasFooter !== false"
            class="calendar-footer" 
            >
                <slot>
                    <button 
                        v-if="!InputDate.isDateDisabled(new Date(), props.minDate, props.maxDate)"
                        type="button" 
                        @click="goToToday" 
                        class="today-button"
                    >
                        {{ t(`input_date.buttons.today`) }}
                    </button>
                    <button type="button" @click="clearDate" class="clear-button">
                        {{ t(`input_date.buttons.clear`) }}
                    </button>
                </slot>
            </div>
        </div>
        
        <ErrorForm 
            v-if="error !== false"
            :name="FormHelper.getInputName(name, form)" 
        />
    </div>
</template>

<script setup>
import { ref, computed, useSlots, watch, onMounted, onUnmounted } from 'vue'
import ErrorForm from '@/services/form/views/ErrorFormComponent.vue'
import Dropdown from '@/components/DropdownComponent.vue'
import { formStore } from '@/services/form/src/form-store.js'
import { t, log } from '@/services/shortcuts/services-shortcut.js'
import { FormHelper } from '@/core/helpers/form-helper.js'
import { useKeyboardNavigation } from '@/services/form/views/inputs/use-keyboard-navigation.js'

const props = defineProps({
  name: { type: String, required: true },
  label: { type: String, required: true },
  cb: { type: Function, default: undefined },
  items: { type: Array, default: undefined },
  closeOnSelect: { type: Boolean, default: true },
  minLenght: { type: Number, default: 1 },
  minLenghtError: { type: String, default: undefined },
  pattern: { type: RegExp, default: undefined },
  displayError: { type: Boolean, default: true },
  form: { type: String, default: undefined },
  required: { type: Boolean, default: false },
  noResult: { type: String, default: 'input_search.no_result' },
  noLabel: { type: Boolean, default: false },
})

const validateProps = () => {
  if (props.cb === undefined && props.items === undefined) {
    throw new Error('InputSearchComponent : la propriété cb ou items doit être renseignée')
  }
  if (props.cb !== undefined && props.items !== undefined) {
    throw new Error("InputSearchComponent : cb et items sont exclusifs, n'en fournir qu'une")
  }
}

validateProps()

const emit = defineEmits(['focus', 'select'])
const inputName = computed(() => FormHelper.getInputName(props.name, props.form))
const state = { timerId: undefined }

const search = defineModel({ type: String, default: '' })
const open = defineModel('open', { type: Boolean, default: false })

watch(search, value => {
  if (value.length > 0) {
    return
  }

  formStore.clearError(inputName.value)
  internalItems.value = []
  open.value = false
})

const loading = ref(false)
const dropdown = ref()
const slots = useSlots()
const internalItems = ref([])
const hasDefaultSlot = Boolean(slots.default)
const displayItems = computed(() => props.items ?? internalItems.value)

watch(open, value => dropdown.value?.toggle(value))

const toggleDropdown = shouldOpen => {
  open.value = shouldOpen ?? !open.value
}

const close = () => {
  open.value = false
}

const select = item => {
  emit('select', item)
  if (props.closeOnSelect) {
    close()
  }
}

const { handleKeydown, resetSelection } = useKeyboardNavigation({
  items: displayItems,
  dropdown,
  toggleDropdown,
  isOpen: open,
})

const DELAY_MS = 500
const runCallback = async () => {
  if (props.cb === undefined) {
    return
  }
  if (search.value.length === 0 || typeof search.value !== 'string') {
    resetSearch()
    return
  }

  loading.value = true
  formStore.clearError(inputName.value)
  if (state.timerId !== undefined) {
    clearTimeout(state.timerId)
  }

  state.timerId = setTimeout(delayCallback, DELAY_MS)
}

const delayCallback = async () => {
  if (search.value.length < props.minLenght) {
    handleInvalidSearch()
    return
  }

  const result = await fetchItems()
  loading.value = false
  internalItems.value = result
  if (hasDefaultSlot && result !== undefined) {
    open.value = result.length > 0 || props.noResult !== undefined
  }
}

const fetchItems = async () => {
  try {
    return await props.cb(search.value)
  } catch (error) {
    handleSearchError(error)
    return []
  }
}

const handleSearchError = error => {
  log.send('Erreur lors de la recherche:', error)
  formStore.addError(inputName.value, t('input_search.error_search'))
}

const handleInvalidSearch = () => {
  if (search.value.length > 0) {
    formStore.addError(
      inputName.value,
      props.minLenghtError ?? t('input_search.error_min_length', { length: props.minLenght }),
    )
  }

  resetSearch()
}

const resetSearch = () => {
  internalItems.value = []
  loading.value = false
  resetSelection()
  open.value = false
}

const inputSearch = ref()
const focus = () => {
  inputSearch.value?.focus()
}

const preventKey = event => {
  if (props.pattern === undefined || props.pattern.test(String.fromCodePoint(event.keyCode))) {
    return true
  }
  event.preventDefault()
  return false
}

const openIfContent = () => {
  open.value =
    search.value.length > 0 && (displayItems.value.length > 0 || props.noResult !== undefined)
}

const handleFocus = () => {
  emit('focus')
  openIfContent()
}

const onDropdownHide = () => {
  open.value = false
  resetSelection()
}

onMounted(() => {
  if (open.value) {
    dropdown.value?.toggle(true)
  }
})

onUnmounted(() => {
  if (state.timerId === undefined) {
    return
  }
  clearTimeout(state.timerId)
})

defineExpose({ focus })
</script>

<template>
  <Dropdown
    ref="dropdown"
    classes="left"
    :autoToggle="false"
    @hide="onDropdownHide"
  >
    <template v-slot:button>
      <div
        class="input-search"
        :class="{ searching: loading }"
      >
        <input
          ref="inputSearch"
          :id="FormHelper.getInputName(name, form)"
          :name="FormHelper.getInputName(name, form)"
          class="form-input input"
          :class="{ 'no-label': noLabel }"
          type="search"
          v-model="search"
          @input="runCallback"
          @keypress="preventKey"
          @focus="handleFocus"
          @click="openIfContent"
          @keydown="handleKeydown"
          autocomplete="off"
          placeholder=""
        />
        <label
          v-if="!noLabel"
          :for="FormHelper.getInputName(name, form)"
          class="form-label"
          :class="{ required: required }"
        >
          {{ label }}
        </label>
        <ErrorForm
          v-if="displayError === true && formStore.hasError(FormHelper.getInputName(name, form))"
          :name="FormHelper.getInputName(name, form)"
        />
      </div>
    </template>
    <template v-slot:items>
      <slot
        :items="displayItems"
        :select="select"
        :close="close"
        v-if="displayItems.length > 0"
      ></slot>
      <p
        v-if="noResult && displayItems.length === 0"
        class="text-center my-5 fw-700 color-neutral-500"
      >
        {{ t(noResult) }}
      </p>
    </template>
  </Dropdown>
</template>

<style lang="scss">
.input-search.searching input[type='search']::-webkit-search-cancel-button {
  display: none;
}
</style>

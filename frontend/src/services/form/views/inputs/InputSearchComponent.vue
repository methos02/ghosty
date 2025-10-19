<script setup>
import { ref, useSlots, watch, onUnmounted } from "vue";
import ErrorForm from "@/services/form/views/ErrorFormComponent.vue"
import Dropdown from "@/components/DropdownComponent.vue";
import { formStore } from "@/services/form/src/form-store.js";
import { t, log } from "@/services/services-helper.js";
import { FormHelper } from "@/services/form/form-helper.js"

const props = defineProps({
  name: {type: String, required : true },
  label: {type: String, required : true},
  cb: {type: Function, required : true },
  minLenght: {type: Number, default: 1},
  minLenghtError : { type: String, default: undefined},
  pattern: { type: RegExp, default: undefined },
  displayError : { type: Boolean, default: true },
  form: { type: String, default: undefined },
  required: { type: Boolean, default: false },
  noResult: { type: String, default: undefined },
})

const search = defineModel({type: String, default: ""})
watch(search, value => { 
  if(value.length > 0) { return }

  formStore.clearError(props.name) 
  items.value = []
})

const loading = ref(false)
const dropdown = ref()
const slots = useSlots()
const items = ref([])
const hasDefaultSlot = Boolean(slots.default)

let timeout_id
const DELAY_MS = 500
const runCallback = async () => {
  if(search.value.length === 0 || typeof search.value !== "string") { resetSearch(); return }

  loading.value = true
  formStore.clearError(props.name)
  if (timeout_id !== null) { clearTimeout(timeout_id) }
  
  timeout_id = setTimeout(delayCallback, DELAY_MS)
}

const delayCallback = async () => {
    if(search.value.length < props.minLenght) {  handleInvalidSearch(); return }

    try {
      items.value = await props.cb(search.value)
      if(hasDefaultSlot && items.value !== undefined ) { toggleDropdown(items.value.length > 0 || props.noResult !== undefined) }

    } catch (error) {
      items.value = []

      if(import.meta.env[`VITE_ENV`] === 'prod') {
        log.send('Erreur lors de la recherche:', error)
        formStore.addflash.error(props.name, t('input_search.error_search'))
        return
      }

      //eslint-disable-next-line no-console
      console.flash.error('Erreur lors de la recherche:', error)
    } finally {
      loading.value = false
    }
}

const handleInvalidSearch = () => {
  if(search.value.length > 0) { 
    formStore.addflash.error(props.name, props.minLenghtError ?? t('input_search.error_min_length', {length : props.minLenght})) 
  }
  
  resetSearch()
}

const resetSearch = () => {
  items.value = []
  loading.value = false
  toggleDropdown(false)
}

const toggleDropdown = state => { 
  dropdown.value.toggle(state)
}

const setItems = value => {
  items.value = value
  if (hasDefaultSlot) { toggleDropdown(items.value.length > 0) }
}

const setSearch = (value = '') => {
  search.value = value
}

const inputSearch = ref()
const focus = () => {
  inputSearch.value.focus();
}

const preventKey = event => {
  if(props.pattern === undefined || props.pattern.test(String.fromCodePoint(event.keyCode))) { return true }
  event.preventDefault()
  return false
}

onUnmounted(() => {
  if (timeout_id === undefined) { return }
  clearTimeout(timeout_id)
})

defineExpose({ runCallback, toggleDropdown, setItems, setSearch, focus})
</script>

<template>
  <Dropdown 
    ref="dropdown" 
    classes="left"
    :autoToggle="false"
  >
    <template v-slot:button >
      <div 
        class="input-search"
        :class="{searching: loading}"
      >
        <input
          ref="inputSearch"
          :id="FormHelper.getInputName(name, form)"
          :name="FormHelper.getInputName(name, form)"
          class="form-input input"
          type="search"
          v-model="search"
          @input="runCallback"
          @keypress="preventKey"
          @focus="toggleDropdown(search.length > 0 && (items?.length > 0 || noResult !== undefined))"
          autocomplete="off"
          placeholder=""
        />
        <label 
          :for="FormHelper.getInputName(name, form)" 
          class="form-label" 
          :class="{required: required}"
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
      <slot :items="items" v-if="items.length > 0"></slot>
      <p v-if="noResult && items.length === 0" class="text-center my-5 fw-700 color-neutral-500">
        {{ t(noResult) }}
      </p>
    </template>
  </Dropdown>
</template>

<style lang="scss">
  .input-search.searching input[type="search"]::-webkit-search-cancel-button {
    display: none;
  }
</style>

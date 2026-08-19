<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  currentChapter: { type: Number, required: true },
  totalChapters: { type: Number, required: true },
})

const emit = defineEmits(['p-chapter'])

const inputChapter = ref(props.currentChapter)

watch(
  () => props.currentChapter,
  newChapter => {
    inputChapter.value = newChapter
  },
)

const goToPrevious = () => {
  if (props.currentChapter <= 1) {
    return
  }
  emit('p-chapter', { chapter: props.currentChapter - 1 })
}

const goToNext = () => {
  if (props.currentChapter >= props.totalChapters) {
    return
  }
  emit('p-chapter', { chapter: props.currentChapter + 1 })
}

const handleInputChange = () => {
  const value = parseInt(inputChapter.value)

  if (Number.isNaN(value)) {
    inputChapter.value = props.currentChapter
    return
  }

  if (value < 1) {
    inputChapter.value = 1
    return
  }

  if (value > props.totalChapters) {
    inputChapter.value = props.totalChapters
    return
  }

  if (value !== props.currentChapter) {
    emit('p-chapter', { chapter: value })
  }
}
</script>

<template>
  <div class="paginator-chapter | d-flex a-center g-8">
    <button
      type="button"
      class="paginator-chapter__button | d-flex a-center j-center pointer"
      :class="{ 'paginator-chapter__button--disabled': currentChapter <= 1 }"
      :disabled="currentChapter <= 1"
      @click="goToPrevious"
      aria-label="Chapitre précédent"
    >
      <i class="fa-solid fa-chevron-left"></i>
    </button>

    <div class="paginator-chapter__input-group | d-flex a-center">
      <input
        v-model="inputChapter"
        type="number"
        min="1"
        :max="totalChapters"
        class="paginator-chapter__input | text-center"
        @blur="handleInputChange"
        @keyup.enter="handleInputChange"
      />
      <span class="paginator-chapter__total | fs-400">/ {{ totalChapters }}</span>
    </div>

    <button
      type="button"
      class="paginator-chapter__button | d-flex a-center j-center pointer"
      :class="{ 'paginator-chapter__button--disabled': currentChapter >= totalChapters }"
      :disabled="currentChapter >= totalChapters"
      @click="goToNext"
      aria-label="Chapitre suivant"
    >
      <i class="fa-solid fa-chevron-right"></i>
    </button>
  </div>
</template>

<style lang="scss">
@use '@/assets/scss/variables' as *;

.paginator-chapter {
  &__button {
    width: 32px;
    height: 32px;
    border: 1px solid $neutral-300;
    border-radius: 4px;
    background-color: $neutral-100;
    color: $neutral-900;
    transition: background-color 0.2s ease;

    &:hover:not(&--disabled) {
      background-color: $neutral-200;
    }

    &--disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    i {
      font-size: 12px;
    }
  }

  &__input-group {
    border: 1px solid $neutral-300;
    border-radius: 4px;
    padding: 4px 8px;
    background-color: $neutral-100;
  }

  &__input {
    width: 35px;
    border: none;
    outline: none;
    background-color: transparent;
    font-size: 16px;
    color: $neutral-900;

    &::-webkit-outer-spin-button,
    &::-webkit-inner-spin-button {
      -webkit-appearance: none;
      margin: 0;
    }

    &[type='number'] {
      -moz-appearance: textfield;
    }
  }

  &__total {
    margin-left: 4px;
    color: $neutral-900;
  }
}
</style>

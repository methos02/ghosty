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
  <div class="paginator-chapter | d-flex a-center">
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

    <div class="paginator-chapter__position | d-flex a-center j-center">
      <input
        v-model="inputChapter"
        type="number"
        min="1"
        :max="totalChapters"
        class="paginator-chapter__input"
        @blur="handleInputChange"
        @keyup.enter="handleInputChange"
      />
      <span class="paginator-chapter__total">/ {{ totalChapters }}</span>
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
.paginator-chapter {
  height: 38px;
  padding: 2px;
  border: 1px solid var(--primary);
  border-radius: 999px;
  background-color: var(--neutral-100);

  &__button {
    width: 32px;
    height: 32px;
    border: none;
    border-radius: 50%;
    background-color: transparent;
    color: var(--primary-700);
    transition: background-color 0.2s ease;

    &:hover:not(&--disabled),
    &:focus-visible {
      background-color: var(--primary-100);
    }

    &--disabled {
      color: var(--neutral-400);
      cursor: not-allowed;
    }

    i {
      font-size: 13px;
    }
  }

  &__position {
    min-width: 64px;
    padding-inline: 4px;
    color: var(--primary-700);
    font-size: var(--fs-500);
    font-weight: 700;
    line-height: 1;
  }

  &__input {
    width: 2.2ch;
    height: 26px;
    padding: 0;
    border: none;
    border-radius: 4px;
    outline: none;
    background-color: transparent;
    color: inherit;
    font: inherit;
    text-align: right;

    &:focus {
      background-color: var(--primary-100);
    }

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
    color: var(--neutral-600);
    font-weight: 600;
  }
}
</style>

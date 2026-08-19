<script setup>
import { ref } from 'vue'
import TextareaComponent from '@/services/form/views/inputs/TextareaComponent.vue'
import { form as formService, t } from '@/services/shortcuts/services-shortcut.js'
import { chapterConfig } from '@/config/chapter-config.js'

const content = defineModel('content', { type: String, default: undefined })
const summary = defineModel('summary', { type: String, default: undefined })

const FORM_SCOPE = 'chapter'

const openSection = ref('content')

const showSection = section => {
  openSection.value = section
}

const sectionClass = section => {
  const color =
    formService.getError(`${FORM_SCOPE}.${section}`) === undefined ? 'primary' : 'danger'
  const variant = openSection.value === section ? '' : '-alt'

  return `btn-${color}${variant}`
}
</script>

<template>
  <div class="chapter-body">
    <div class="chapter-body__sections | d-flex j-center g-20 my-20">
      <button
        type="button"
        @click="showSection('content')"
        class="chapter-body__section | btn"
        :class="sectionClass('content')"
      >
        {{ t('chapter_body.content') }}
      </button>
      <button
        type="button"
        @click="showSection('summary')"
        class="chapter-body__section | btn"
        :class="sectionClass('summary')"
      >
        {{ t('chapter_body.summary') }}
      </button>
    </div>

    <div
      v-if="openSection === 'content'"
      class="form-row"
    >
      <TextareaComponent
        v-model="content"
        name="content"
        :label="t('chapter_body.content')"
        :required="true"
        :autogrow="true"
        :form="FORM_SCOPE"
      />
    </div>

    <div
      v-if="openSection === 'summary'"
      class="form-row"
    >
      <TextareaComponent
        v-model="summary"
        name="summary"
        :label="t('chapter_body.summary')"
        :required="true"
        :maxLength="chapterConfig.summaryMaxLength"
        :form="FORM_SCOPE"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.chapter-body {
  &__section {
    min-width: 180px;
  }

  :deep(textarea) {
    min-height: 220px;
  }
}
</style>

<script setup>
import { computed } from 'vue'
import { t } from '@/services/shortcuts/services-shortcut.js'
import { ConfigLoader } from '@/config/config-loader.js'
import SelectComponent from '@/services/form/views/inputs/SelectComponent.vue'
import { useReadingSettingsStore } from '@/apis/chapters/stores/reading-settings-store.js'
import { readingSettingsHelper } from '@/core/helpers/reading-settings-helper.js'

const { settings, setSetting, persist } = useReadingSettingsStore()

const widthRange = computed(() => ConfigLoader.get('reading.width'))
const fontSizes = computed(() => readingSettingsHelper.fontSizes())
const fontFamilies = computed(() => ConfigLoader.get('reading.fontFamily.available'))

const change = (name, value) => {
  setSetting(name, value)
  persist()
}

const fontSize = computed({
  get: () => settings.value.fontSize,
  set: value => change('fontSize', Number(value)),
})

const fontFamily = computed({
  get: () => settings.value.fontFamily,
  set: value => change('fontFamily', value),
})
</script>

<template>
  <div class="reading-settings | d-flex f-column g-15 p-15">
    <div class="reading-settings__width | d-flex f-column g-5">
      <label
        class="fs-300 color-neutral-700"
        for="reading-width"
      >
        {{ t('reading_settings.width') }}
      </label>
      <input
        id="reading-width"
        class="reading-settings__width-input"
        type="range"
        :min="widthRange.min"
        :max="widthRange.max"
        :step="widthRange.step"
        :value="settings.width"
        @input="change('width', Number($event.target.value))"
      />
    </div>

    <SelectComponent
      v-model="fontSize"
      name="font_size"
      form="reading"
      :label="t('reading_settings.font_size')"
      :error="false"
      containerClass="reading-settings__font-size"
    >
      <option
        v-for="size in fontSizes"
        :key="size"
        :value="size"
      >
        {{ size }} px
      </option>
    </SelectComponent>

    <SelectComponent
      v-model="fontFamily"
      name="font_family"
      form="reading"
      :label="t('reading_settings.font_family')"
      :error="false"
      :containerClass="`reading-settings__font-family ${readingSettingsHelper.fontFamilyClass(fontFamily)}`"
    >
      <option
        v-for="font in fontFamilies"
        :key="font.value"
        :value="font.value"
        :class="readingSettingsHelper.fontFamilyClass(font.value)"
      >
        {{ font.label }}
      </option>
    </SelectComponent>
  </div>
</template>

<style lang="scss" scoped>
.reading-settings {
  width: 260px;

  &__width-input {
    accent-color: var(--primary);
    width: 100%;
  }

  :deep(.select-container) {
    width: 100%;
  }

  &__font-family :deep(select) {
    font-family: inherit;
  }
}
</style>

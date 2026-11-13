<script setup>
import { onBeforeUnmount, ref, watch } from 'vue'
import { t } from '@/services/shortcuts/services-shortcut.js'
import CoverCropper from '@/views/covers/parts/CoverCropper.vue'
import { validateCoverCropForm } from '@/apis/covers/formRequest/cover-crop-form-request.js'
import { imageCropHelper } from '@/core/helpers/image-crop-helper.js'
import { imageFileHelper } from '@/core/helpers/image-file-helper.js'

const props = defineProps({
  modelValue: { type: Object, default: undefined },
})

const emit = defineEmits(['update:modelValue'])

const input = ref()
const source = ref()
const crop = ref()
const previewUrl = ref('')
const isCropping = ref(false)
const isDragOver = ref(false)
const isProcessing = ref(false)

const release = () => {
  source.value?.bitmap.close?.()
  if (source.value) {
    URL.revokeObjectURL(source.value.url)
  }
  if (previewUrl.value !== '') {
    URL.revokeObjectURL(previewUrl.value)
  }

  source.value = undefined
  previewUrl.value = ''
  isCropping.value = false
}

const render = async () => {
  const image = await imageFileHelper.renderCrop(source.value.bitmap, crop.value)

  if (previewUrl.value !== '') {
    URL.revokeObjectURL(previewUrl.value)
  }
  previewUrl.value = URL.createObjectURL(image)
  emit('update:modelValue', image)
}

const load = async file => {
  isProcessing.value = true
  release()
  emit('update:modelValue')

  const image = await imageFileHelper.decode(file)

  if (!validateCoverCropForm(image).valid) {
    image.bitmap?.close?.()
    isProcessing.value = false
    return
  }

  const size = { width: image.width, height: image.height }
  source.value = {
    url: URL.createObjectURL(file),
    bitmap: image.bitmap,
    size,
  }
  crop.value = imageCropHelper.fullCrop(size)
  await render()
  isProcessing.value = false
}

const openPicker = () => {
  input.value.click()
}

const pickFromInput = async event => {
  const [file] = event.target.files
  event.target.value = ''

  if (file !== undefined) {
    await load(file)
  }
}

const pickFromDrop = async event => {
  isDragOver.value = false
  const [file] = event.dataTransfer.files

  if (file !== undefined) {
    await load(file)
  }
}

const applyCrop = async newCrop => {
  crop.value = newCrop
  isCropping.value = false
  await render()
}

watch(
  () => props.modelValue,
  value => {
    if (value === undefined && !isProcessing.value) {
      release()
    }
  },
)

onBeforeUnmount(release)
</script>

<template>
  <div class="cover-image-field | d-flex f-column g-10">
    <input
      ref="input"
      type="file"
      name="image"
      accept="image/*"
      class="cover-image-field__input | d-none"
      @change="pickFromInput"
    />

    <CoverCropper
      v-if="isCropping"
      :imageUrl="source.url"
      :size="source.size"
      :initialCrop="crop"
      @apply="applyCrop"
      @cancel="isCropping = false"
    />

    <template v-else-if="previewUrl !== ''">
      <img
        :src="previewUrl"
        :alt="t('cover_image_field.preview')"
        class="cover-image-field__preview | radius-5"
      />

      <div class="cover-image-field__actions | d-flex j-between g-10">
        <button
          type="button"
          class="cover-image-field__crop | btn btn-sm btn-primary-alt d-flex a-center g-5"
          @click="isCropping = true"
        >
          <i class="fa-solid fa-crop-simple"></i>
          {{ t('cover_image_field.crop') }}
        </button>
        <button
          type="button"
          class="cover-image-field__change | btn btn-sm btn-primary-alt d-flex a-center g-5"
          @click="openPicker"
        >
          <i class="fa-solid fa-arrows-rotate"></i>
          {{ t('cover_image_field.change') }}
        </button>
      </div>
    </template>

    <button
      v-else
      type="button"
      class="cover-image-field__dropzone | d-flex f-column a-center j-center g-10 radius-5 w-full"
      :class="{ 'cover-image-field__dropzone--over': isDragOver }"
      :disabled="isProcessing"
      @click="openPicker"
      @dragover.prevent="isDragOver = true"
      @dragleave="isDragOver = false"
      @drop.prevent="pickFromDrop"
    >
      <i
        v-if="isProcessing"
        class="fa-solid fa-spinner fa-spin fs-700 color-primary"
      ></i>
      <i
        v-else
        class="fa-solid fa-image fs-700 color-primary"
      ></i>
      <span
        v-if="isProcessing"
        class="fw-500 color-neutral-900"
      >
        {{ t('cover_image_field.processing') }}
      </span>
      <template v-else>
        <span class="fw-500 color-neutral-900">{{ t('cover_image_field.choose') }}</span>
        <span class="fs-300 color-neutral-700">{{ t('cover_image_field.drop') }}</span>
      </template>
    </button>
  </div>
</template>

<style lang="scss" scoped>
.cover-image-field {
  &__preview {
    width: 100%;
    aspect-ratio: 16 / 9;
    object-fit: cover;
  }

  &__dropzone {
    aspect-ratio: 16 / 9;
    border: 2px dashed var(--neutral-400);
    background: var(--neutral-200);
    cursor: pointer;
    transition:
      border-color 200ms linear,
      background-color 200ms linear;

    &:hover,
    &:focus-visible,
    &--over {
      border-color: var(--primary);
      background: var(--primary-100);
    }

    &:disabled {
      cursor: progress;
    }
  }
}
</style>

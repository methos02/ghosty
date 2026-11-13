<script setup>
import { computed, ref } from 'vue'
import { t } from '@/services/shortcuts/services-shortcut.js'
import { ConfigLoader } from '@/config/config-loader.js'
import { imageCropHelper } from '@/core/helpers/image-crop-helper.js'

const props = defineProps({
  imageUrl: { type: String, required: true },
  size: { type: Object, required: true },
  initialCrop: { type: Object, required: true },
})

const emit = defineEmits(['apply', 'cancel'])

const crop = ref(props.initialCrop)
const lastPointer = ref()

const maxZoom = computed(() => imageCropHelper.maxZoom(props.size))
const zoom = computed(() => imageCropHelper.zoomOf(crop.value, props.size))

const imageStyle = computed(() => {
  const placement = imageCropHelper.placement(crop.value, props.size)

  return {
    width: `${placement.width}%`,
    left: `${placement.left}%`,
    top: `${placement.top}%`,
  }
})

const setZoom = value => {
  crop.value = imageCropHelper.zoomCrop(crop.value, props.size, value)
}

const zoomWithWheel = event => {
  setZoom(zoom.value * (1 - event.deltaY * ConfigLoader.get('cover.wheelZoomSpeed')))
}

const startDrag = event => {
  event.currentTarget.setPointerCapture?.(event.pointerId)
  lastPointer.value = { x: event.clientX, y: event.clientY }
}

const drag = event => {
  if (lastPointer.value === undefined) {
    return
  }

  const movement = {
    x: event.clientX - lastPointer.value.x,
    y: event.clientY - lastPointer.value.y,
    frameWidth: event.currentTarget.clientWidth,
  }
  crop.value = imageCropHelper.dragCrop(crop.value, props.size, movement)
  lastPointer.value = { x: event.clientX, y: event.clientY }
}

const stopDrag = () => {
  lastPointer.value = undefined
}
</script>

<template>
  <div class="cover-cropper | d-flex f-column g-10">
    <div
      class="cover-cropper__frame | radius-5"
      :class="{ 'cover-cropper__frame--dragging': lastPointer }"
      @pointerdown.prevent="startDrag"
      @pointermove="drag"
      @pointerup="stopDrag"
      @pointercancel="stopDrag"
      @wheel.prevent="zoomWithWheel"
    >
      <img
        :src="imageUrl"
        :alt="t('cover_cropper.image_alt')"
        :style="imageStyle"
        draggable="false"
        class="cover-cropper__image"
      />
      <div class="cover-cropper__grid"></div>
    </div>

    <p class="cover-cropper__hint | d-flex a-center g-5 fs-200 color-neutral-700">
      <i class="fa-solid fa-up-down-left-right"></i>
      {{ t('cover_cropper.hint') }}
    </p>

    <label class="cover-cropper__zoom | d-flex a-center g-10 color-neutral-700">
      <i
        class="fa-solid fa-image fs-200"
        :title="t('cover_cropper.zoom')"
      ></i>
      <input
        type="range"
        class="cover-cropper__zoom-input | flex-1"
        min="1"
        :max="maxZoom"
        step="0.01"
        :value="zoom"
        :aria-label="t('cover_cropper.zoom')"
        :disabled="maxZoom <= 1"
        @input="setZoom(Number($event.target.value))"
      />
      <i class="fa-solid fa-image fs-500"></i>
    </label>

    <div class="cover-cropper__actions | d-flex j-end g-10">
      <button
        type="button"
        class="cover-cropper__cancel | btn btn-sm btn-primary-alt"
        @click="emit('cancel')"
      >
        {{ t('cover_cropper.cancel') }}
      </button>
      <button
        type="button"
        class="cover-cropper__apply | btn btn-sm btn-primary d-flex a-center g-5"
        @click="emit('apply', crop)"
      >
        <i class="fa-solid fa-check"></i>
        {{ t('cover_cropper.apply') }}
      </button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.cover-cropper {
  &__frame {
    position: relative;
    overflow: hidden;
    width: 100%;
    aspect-ratio: 16 / 9;
    background: var(--neutral-900);
    cursor: grab;
    touch-action: none;
    user-select: none;

    &--dragging {
      cursor: grabbing;
    }
  }

  &__image {
    position: absolute;
    max-width: none;
    height: auto;
    pointer-events: none;
  }

  &__grid {
    position: absolute;
    inset: 0;
    pointer-events: none;
    box-shadow: inset 0 0 0 2px var(--primary);
    background-image:
      linear-gradient(to right, rgb(255 255 255 / 0.35) 1px, transparent 1px),
      linear-gradient(to bottom, rgb(255 255 255 / 0.35) 1px, transparent 1px);
    background-size: calc(100% / 3) calc(100% / 3);
  }

  &__zoom-input {
    accent-color: var(--primary);
  }
}
</style>

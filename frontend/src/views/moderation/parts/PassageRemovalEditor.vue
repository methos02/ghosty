<script setup>
import { computed, ref } from 'vue'
import { t } from '@/services/shortcuts/services-shortcut.js'
import ErrorFormComponent from '@/services/form/views/ErrorFormComponent.vue'
import { passageRemovalHelper } from '@/core/helpers/passage-removal-helper.js'

const props = defineProps({
  original: { type: String, required: true },
})

const content = defineModel({ type: String, required: true })

const OUTSIDE_SOURCE = -1
const EMPTY_RANGE = { start: 0, end: 0 }

const source = ref()

const segments = computed(() => passageRemovalHelper.splitWithPositions(content.value))

const hasRemovedPassage = computed(() => content.value !== props.original)

const childPosition = childIndex => {
  const child = source.value.children[childIndex]
  if (child === undefined) {
    return content.value.length
  }

  return Number(child.dataset.start)
}

const segmentPosition = (segmentElement, offset, isEnd) => {
  if (segmentElement.dataset.removed === 'true') {
    return Number(isEnd ? segmentElement.dataset.end : segmentElement.dataset.start)
  }

  return Number(segmentElement.dataset.start) + offset
}

const positionInContent = (node, offset, isEnd) => {
  if (node === source.value) {
    return childPosition(offset)
  }

  const element = node.nodeType === globalThis.Node.TEXT_NODE ? node.parentElement : node
  const segmentElement = element?.closest('[data-start]')
  if (!segmentElement || !source.value.contains(segmentElement)) {
    return OUTSIDE_SOURCE
  }

  return segmentPosition(segmentElement, offset, isEnd)
}

const selectedRange = () => {
  const selection = globalThis.getSelection()
  if (!selection || selection.rangeCount === 0 || selection.isCollapsed) {
    return EMPTY_RANGE
  }

  const range = selection.getRangeAt(0)

  return {
    start: positionInContent(range.startContainer, range.startOffset, false),
    end: positionInContent(range.endContainer, range.endOffset, true),
  }
}

const isRemovable = range =>
  range.start !== OUTSIDE_SOURCE && range.end !== OUTSIDE_SOURCE && range.start < range.end

const removeSelection = () => {
  const range = selectedRange()
  if (!isRemovable(range)) {
    return
  }

  content.value = passageRemovalHelper.removeSelection(content.value, range)
  globalThis.getSelection().removeAllRanges()
}

const reset = () => {
  content.value = props.original
}
</script>

<template>
  <div class="passage-removal-editor | d-flex f-column g-15">
    <div
      class="passage-removal-editor__toolbar | d-flex a-center j-between g-15 f-wrap bg-neutral-100 p-15 radius-10"
    >
      <p class="passage-removal-editor__hint | fs-300 color-neutral-700">
        {{ t('passage_removal_editor.hint') }}
      </p>

      <div class="d-flex g-10 f-wrap">
        <button
          type="button"
          @mousedown.prevent
          @click="removeSelection"
          class="passage-removal-editor__remove | btn btn-danger-alt"
        >
          {{ t('passage_removal_editor.remove_selection') }}
        </button>
        <button
          type="button"
          @click="reset"
          :disabled="!hasRemovedPassage"
          class="passage-removal-editor__reset | btn btn-primary-alt"
        >
          {{ t('passage_removal_editor.reset') }}
        </button>
      </div>

      <ErrorFormComponent name="moderation.content" />
    </div>

    <div
      ref="source"
      class="passage-removal-editor__source | bg-neutral-200 p-20 radius-10"
      :aria-label="t('passage_removal_editor.source')"
    >
      <template
        v-for="segment in segments"
        :key="segment.start"
      >
        <span
          v-if="segment.isRemoved"
          :data-start="segment.start"
          :data-end="segment.end"
          data-removed="true"
          class="passage-removal-editor__removed | fs-300 color-neutral-600"
        >
          {{ t('passage_removal_editor.removed_passage') }}
        </span>
        <span
          v-else
          :data-start="segment.start"
          :data-end="segment.end"
          class="passage-removal-editor__text"
        >
          {{ segment.text }}
        </span>
      </template>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.passage-removal-editor {
  &__toolbar {
    position: sticky;
    top: 0;
    z-index: 1;
    box-shadow: 0 2px 6px rgb(0 0 0 / 8%);
  }

  &__source {
    line-height: 1.6;
    white-space: pre-wrap;
  }

  &__text::selection {
    background-color: var(--danger-300);
  }

  &__removed {
    font-style: italic;
    user-select: none;
  }
}
</style>

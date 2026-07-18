<script setup>
import { ref } from 'vue'
import PaginatorClassic from '@brugmann/vuemann/src/components/paginators/PaginatorClassicComponent.vue'
import PaginatorInfinite from '@brugmann/vuemann/src/components/paginators/PaginatorInfiniteComponent.vue'
import { paginatorHelper as paginatorH } from '@brugmann/vuemann/src/helpers/paginator-helper.js'

const props = defineProps({
  type: { type: String, default: 'classic' },
  cb: { type: Function, required: true },
  params: { type: Object, required: true },
})

const loadingPage = ref(undefined)

const handlePageClick = async ({ page, size }) => {
  loadingPage.value = page
  await props.cb(page, size)
  loadingPage.value = undefined
}
</script>

<template>
  <div class="paginator-container">
    <div
      v-if="
        (params === undefined || params.size !== undefined) &&
        paginatorH.calculTotalPage(props.params.total, props.params.size) > 1
      "
      class="paginator-container"
    >
      <PaginatorClassic
        v-if="type === 'classic'"
        :params="params"
        :loadingPage="loadingPage"
        @p-classic="handlePageClick"
      />
      <PaginatorInfinite
        v-if="type === 'infinite'"
        :params="params"
        :cb="cb"
      >
        <slot></slot>
      </PaginatorInfinite>
    </div>
  </div>
</template>

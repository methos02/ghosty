<script setup>
import { onMounted, ref, watch } from "vue";
import { paginatorHelper as paginatorH } from "@brugmann/vuemann/src/helpers/paginator-helper.js";
import { vInfiniteScroll } from '@vueuse/components'

const props = defineProps({ 
    cb: { type: Function, default: undefined },
    params : { type: Object, required: true }
})

const totalPage = ref()
const currentPage = ref()
onMounted(() => {
    currentPage.value = props.params.page
    totalPage.value = paginatorH.calculTotalPage(props.params.total, props.params.size)
})

watch(() => props.params.page, page => {
    currentPage.value = page
})

watch(() => props.params.total, NewtotalPage => {
    totalPage.value = paginatorH.calculTotalPage(NewtotalPage, props.params.size)
})

const runCallBack = async () => {
    const nextPage = currentPage.value + 1
    if(nextPage > totalPage.value) { return }

    await props.cb(nextPage, props.params.size)
}

</script>

<template>
    <div v-infinite-scroll="[runCallBack, { distance: 10 }]" class="paginator-infinite_container">
        <slot></slot>
    </div>
</template>

<style lang="scss">
    .paginator-infinite {
        &_container {
            overflow-y: auto;
            overflow-x: hidden;
        }
    }
</style>

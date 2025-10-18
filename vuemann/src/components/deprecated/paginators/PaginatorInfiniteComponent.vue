<script setup>
import { onMounted, ref, watch } from "vue";
import { paginatorHelper as paginatorH } from "@brugmann/vuemann/src/components/deprecated/paginator-helper.js";
import { vInfiniteScroll } from '@vueuse/components'

const props = defineProps({ 
    cb: { type: Function, default: undefined },
    params : {
        type: Object,
        default: () => { return { total: 0, limit: 10, skip: 0 }}
    },
})

const totalPage = ref()
const currentPage = ref()
onMounted(() => {
    currentPage.value = paginatorH.currentPage(props.params.skip, props.params.limit)
    totalPage.value = paginatorH.calculTotalPage(props.params.total, props.params.limit)
})

watch(() => props.params.skip, skip => {
    currentPage.value = (skip / props.params.limit) + 1
})

watch(() => props.params.total, NewtotalPage => {
    totalPage.value = paginatorH.calculTotalPage(NewtotalPage, props.params.limit)
})

const runCallBack = async () => {
    const nextPage = currentPage.value + 1
    if(nextPage > totalPage.value) { return }

    await props.cb(paginatorH.calculSkip(nextPage, props.params.limit), props.params.limit)
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

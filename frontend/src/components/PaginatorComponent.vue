<script setup>
import PaginatorClassic from "@/components/paginators/PaginatorClassicComponent.vue";
import PaginatorLoadMore from "@/components/paginators/PaginatorLoadMoreComponent.vue";
import PaginatorInfinite from "@/components/paginators/PaginatorInfiniteComponent.vue";

const props = defineProps({
    type : { type: String, default: 'classic'},
    cb: { type: Function, required: true },
    params : { type: Object, required: true }
})

const handlePageClick = async ({page, size}) => await props.cb( page, size )
</script>

<template>
    <PaginatorInfinite v-if="type === 'infinite'" :params="params" :cb="cb">
        <slot></slot>
    </PaginatorInfinite>
    <div v-else class="paginator-container">
        <div v-if="params.lastPage > 1" class="paginator-container">
            <PaginatorClassic v-if="type === 'classic'" :params="params" @p-classic="handlePageClick" />
            <PaginatorLoadMore v-if="type === 'load-more'" :params="params" @p-loadmore="handlePageClick"/>
        </div>
    </div>
</template>
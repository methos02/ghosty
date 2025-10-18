<script setup>
import Paginator from "@brugmann/vuemann/src/components/deprecated/PaginatorComponent.vue";
import PaginatorClassic from "@brugmann/vuemann/src/components/paginators/PaginatorClassicComponent.vue";
import PaginatorLoadMore from "@brugmann/vuemann/src/components/paginators/PaginatorLoadMoreComponent.vue";
import PaginatorRange from "@brugmann/vuemann/src/components/paginators/PaginatorRangeComponent.vue";
import PaginatorInfinite from "@brugmann/vuemann/src/components/paginators/PaginatorInfiniteComponent.vue";
import { paginatorHelper as paginatorH } from "@brugmann/vuemann/src/helpers/paginator-helper.js";

const props = defineProps({ 
    type : { type: String, default: 'classic'},
    cb: { type: Function, required: true },
    params : { type: Object, required: true }
})

const handlePageClick = async ({page, size}) => await props.cb( page, size )
</script>

<template>
    <div class="paginator-container">
        <div 
            v-if="(params === undefined || params.size !== undefined) && paginatorH.calculTotalPage(props.params.total, props.params.size) > 1"
            class="paginator-container"
        >
            <PaginatorClassic v-if="type === 'classic'" :params="params" @p-classic="handlePageClick" />
            <PaginatorLoadMore v-if="type === 'load-more'" :params="params" @p-loadmore="handlePageClick"/>
            <PaginatorRange v-if="type === 'range'" :params="params" @p-range="handlePageClick"/>
            <PaginatorInfinite v-if="type === 'infinite'" :params="params" :cb="cb">
                <slot></slot>
            </PaginatorInfinite>
        </div>
        <Paginator v-if="params.skip !== undefined" :type="type" :cb="cb" :params="params">
            <slot></slot>
        </Paginator>
    </div>
</template>

<script setup>
import PaginatorClassic from "@brugmann/vuemann/src/components/deprecated/paginators/PaginatorClassicComponent.vue";
import PaginatorLoadMore from "@brugmann/vuemann/src/components/deprecated/paginators/PaginatorLoadMoreComponent.vue";
import PaginatorRange from "@brugmann/vuemann/src/components/deprecated/paginators/PaginatorRangeComponent.vue";
import PaginatorInfinite from "@brugmann/vuemann/src/components/deprecated/paginators/PaginatorInfiniteComponent.vue";
import { servicesM } from "@brugmann/vuemann/src/services/services-manager.js";

const props = defineProps({ 
    type : { type: String, default: 'classic'},
    cb: { type: Function, required: true },
    params : {
        type: Object,
        default: () => { return { total: 0, limit: 10, skip: 0 }}
    }
})

servicesM.service('utils:isDeprecated', "Cette version du paginator est déprecié car elle utilise n'utilise pas le standart des apis Brugmann")
const handlePageClick = async ({skip, limit}) => await props.cb( skip, limit )
</script>

<template>
    <div class="paginator-container">
        <PaginatorClassic v-if="type === 'classic'" :params="params" @p-classic="handlePageClick" />
        <PaginatorLoadMore v-if="type === 'load-more'" :params="params" @p-loadmore="handlePageClick"/>
        <PaginatorRange v-if="type === 'range'" :params="params" @p-range="handlePageClick"/>
        <PaginatorInfinite v-if="type === 'infinite'" :params="params" :cb="cb">
            <slot></slot>
        </PaginatorInfinite>
    </div>
</template>



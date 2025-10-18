<script setup>
import { onMounted, ref, watch } from "vue";
import { paginatorHelper as paginatorH } from "@brugmann/vuemann/src/components/deprecated/paginator-helper.js";


const props = defineProps({ 
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
    links.value = generateLinks()
})

watch(() => props.params.skip, skip => {
    currentPage.value = (skip / props.params.limit) + 1
    links.value = generateLinks()
})

watch(() => props.params.total, NewtotalPage => {
    totalPage.value = paginatorH.calculTotalPage(NewtotalPage, props.params.limit)
    links.value = generateLinks()
})

/* eslint-disable no-magic-numbers */
const links = ref([])
const pagesLinked = () => [1,2, currentPage.value - 2, currentPage.value - 1, currentPage.value, currentPage.value + 1, currentPage.value + 2, totalPage.value - 1, totalPage.value]
const generateLinks = () => {
    const links = [];

    for (let page_number = 1; page_number <= totalPage.value; page_number++) {
        if(page_number === 3 && currentPage.value >= 6) { links.push('...') }

        if(pagesLinked().includes(page_number)) { links.push({page_number}) }

        if(page_number === totalPage.value - 3 && currentPage.value <= totalPage.value - 5) { links.push('...') }
    }

    return links;
}
/* eslint-enable no-magic-numbers */

const emit = defineEmits(['p-classic']);
const handlePageClick = page_number => {
  emit('p-classic', { skip: paginatorH.calculSkip(page_number, props.params.limit), limit: props.params.limit });
};
</script>

<template>
    <nav 
        v-if="totalPage !== 1"
        class="paginator-container | d-flex j-center"
    >
        <ul class="paginator | d-flex a-center py-15">
            <!-- Previous Page Link -->
           <template v-if="currentPage === 1">
               <li class="paginator-li disabled" aria-disabled="true" aria-label="Page précédente" data-button="previous">
                   <span class="paginator-chevron" aria-hidden="true">
                        <i class="fa-solid fa-chevron-left"></i>
                   </span>
                </li>
            </template>
            <template v-else>
                <li class="paginator-li">
                    <button type="button" @click="handlePageClick(currentPage - 1)" class="paginator-button" rel="prev" aria-label="Page précédente" data-button="previous">
                        <i class="fa-solid fa-chevron-left"></i>
                    </button>
                </li>
            </template>
            <!-- paginator Elements -->
            <template v-for="(link, index) in links" :key="index">
                <template v-if="typeof link === 'object' && currentPage === link.page_number">
                    <li class="paginator-li active" aria-current="page" :data-current="currentPage">
                        <span class="paginator-current">{{ link.page_number }}</span>
                    </li>
                </template>
                <template v-else-if="typeof link === 'object'">
                    <li 
                        class="paginator-li"
                        :class="{'hide-lg': [currentPage - 2, currentPage + 2].includes(link.page_number)}"
                    >
                        <button type="button" @click="handlePageClick(link.page_number)" class="paginator-button" :data-page="link.page_number">
                            {{ link.page_number }}
                        </button>
                    </li>
                </template>
                <template v-else>
                    <li class="paginator-li" aria-disabled="true">
                        <span>{{ link }}</span>
                    </li>
                </template>
            </template>
            <!-- Next Page Link -->
            <template v-if="currentPage !== totalPage">
                <li class="paginator-li">
                    <button type="button" class="paginator-button" rel="next" aria-label="Page suivante" @click="handlePageClick(currentPage + 1)" data-button="next">
                        <i class="fa-solid fa-chevron-right"></i>
                    </button>
                </li>
            </template>
            <template v-else>
                <li class="paginator-li disabled" aria-disabled="true" aria-label="Page suivante" data-button="next">
                    <span class="paginator-chevron" aria-hidden="true">
                        <i class="fa-solid fa-chevron-right"></i>
                    </span>
                </li>
            </template>
        </ul>
    </nav>
</template>

<style lang="scss">
@use '../../../assets/scss/variables';

@use "sass:color";

.paginator-container {
    .paginator {
        overflow: hidden;

        &-current, &-chevron, &-button { padding: 15px; }

        &-li {
            &.active {
                background-color: variables.$primary;
                color: variables.$neutral-100;
            }

            &.disabled { color: variables.$neutral-500;}

            &.hide-lg {
                @media (max-width: variables.$lg) { display: none; }
            }

            > * { display: inline-block; }
        }

        &-button {
            color: variables.$neutral-800;
            cursor: pointer;
            
            &:hover { background-color: color.adjust(variables.$neutral-800, $lightness: 40%, $space: hsl); }
        }
    }
}
</style>

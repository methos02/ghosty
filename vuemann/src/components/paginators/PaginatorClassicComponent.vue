<script setup>
import { onMounted, ref, watch } from "vue";
import { paginatorHelper as paginatorH } from "@brugmann/vuemann/src/helpers/paginator-helper.js";
import { t } from '@brugmann/vuemann/src/services/services-helper.js'

const props = defineProps({ 
    params : { type: Object, required: true },
})

const totalPage = ref()
const currentPage = ref()

onMounted(() => {
    currentPage.value = props.params.page
    totalPage.value = paginatorH.calculTotalPage(props.params.total, props.params.size)
    links.value = generateLinks()
})

watch(() => props.params.page, page => {
    currentPage.value = page
    links.value = generateLinks()
})

watch(() => props.params.total, NewtotalPage => {
    totalPage.value = paginatorH.calculTotalPage(NewtotalPage, props.params.size)
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
const handlePageClick = page => {
  emit('p-classic', { page: page, size: props.params.size });
};
</script>

<template>
    <nav class="paginator-container | d-flex j-center">
        <ul class="paginator | d-flex a-center py-15">
            <!-- Previous Page Link -->
           <template v-if="currentPage === 1">
               <li class="paginator-li disabled" aria-disabled="true" :aria-label="t('paginator.previous_page')" data-button="previous">
                   <span class="paginator-chevron" aria-hidden="true">
                        <i class="fa-solid fa-chevron-left"></i>
                   </span>
                </li>
            </template>
            <template v-else>
                <li class="paginator-li">
                    <button type="button" @click="handlePageClick(currentPage - 1)" class="paginator-button" rel="prev" :aria-label="t('paginator.previous_page')" data-button="previous">
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
                    <button type="button" class="paginator-button" rel="next" :aria-label="t('paginator.next_page')" @click="handlePageClick(currentPage + 1)" data-button="next">
                        <i class="fa-solid fa-chevron-right"></i>
                    </button>
                </li>
            </template>
            <template v-else>
                <li class="paginator-li disabled" aria-disabled="true" :aria-label="t('paginator.next_page')" data-button="next">
                    <span class="paginator-chevron" aria-hidden="true">
                        <i class="fa-solid fa-chevron-right"></i>
                    </span>
                </li>
            </template>
        </ul>
    </nav>
</template>

<style lang="scss">
@use '../../assets/scss/variables';

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

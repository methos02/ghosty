<script setup>
import { computed } from "vue";
import { t } from '@/services/services-helper.js'

const props = defineProps({
    params : { type: Object, required: true },
})

/* eslint-disable no-magic-numbers */
const pagesLinked = computed(() => [
    1, 2,
    props.params.page - 2,
    props.params.page - 1,
    props.params.page,
    props.params.page + 1,
    props.params.page + 2,
    props.params.lastPage - 1,
    props.params.lastPage
])

const links = computed(() => {
    const linksList = [];

    for (let page_number = 1; page_number <= props.params.lastPage; page_number++) {
        if(page_number === 3 && props.params.page >= 6) { linksList.push('...') }

        if(pagesLinked.value.includes(page_number)) { linksList.push({page_number}) }

        if(page_number === props.params.lastPage - 3 && props.params.page <= props.params.lastPage - 5) { linksList.push('...') }
    }

    return linksList;
})
/* eslint-enable no-magic-numbers */

const emit = defineEmits(['p-classic']);
const handlePageClick = (page) => {
    emit('p-classic', { page, size: props.params.size });
};
</script>

<template>
    <nav class="paginator-container | d-flex j-center">
        <ul class="paginator | d-flex a-center py-15">
            <!-- Previous Page Link -->
           <template v-if="params.page === 1">
               <li class="paginator-li disabled" aria-disabled="true" :aria-label="t('paginator.previous_page')" data-button="previous">
                   <span class="paginator-chevron" aria-hidden="true">
                        <i class="fa-solid fa-chevron-left"></i>
                   </span>
                </li>
            </template>
            <template v-else>
                <li class="paginator-li">
                    <button type="button" @click="handlePageClick(params.page - 1)" class="paginator-button" rel="prev" :aria-label="t('paginator.previous_page')" data-button="previous">
                        <i class="fa-solid fa-chevron-left"></i>
                    </button>
                </li>
            </template>
            <!-- paginator Elements -->
            <template v-for="(link, index) in links" :key="index">
                <template v-if="typeof link === 'object' && params.page === link.page_number">
                    <li class="paginator-li active" aria-current="page" :data-current="params.page">
                        <span class="paginator-current">{{ link.page_number }}</span>
                    </li>
                </template>
                <template v-else-if="typeof link === 'object'">
                    <li
                        class="paginator-li"
                        :class="{'hide-lg': [params.page - 2, params.page + 2].includes(link.page_number)}"
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
            <template v-if="params.page !== params.lastPage">
                <li class="paginator-li">
                    <button type="button" class="paginator-button" rel="next" :aria-label="t('paginator.next_page')" @click="handlePageClick(params.page + 1)" data-button="next">
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

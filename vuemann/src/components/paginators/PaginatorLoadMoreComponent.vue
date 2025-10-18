<script setup>
import { onMounted, ref, watch } from "vue";
import { paginatorHelper as paginatorH } from "@brugmann/vuemann/src/helpers/paginator-helper.js";
import { t } from '@brugmann/vuemann/src/services/services-helper.js'
import { utilsH } from "@brugmann/vuemann/src/helpers/utils-helper.js";

const props = defineProps({ 
    params : { type: Object, required: true }
})

const totalPage = ref()
const currentPage = ref()
const progress = ref()

onMounted(() => {
    currentPage.value = props.params.page
    totalPage.value = paginatorH.calculTotalPage(props.params.total, props.params.size)
    progress.value = utilsH.percentOf(currentPage.value, totalPage.value)
})

watch(() => props.params.page, page => {
    currentPage.value = page
    progress.value = utilsH.percentOf(currentPage.value, totalPage.value)
})

watch(() => props.params.total, NewtotalPage => {
    totalPage.value = paginatorH.calculTotalPage(NewtotalPage, props.params.size)
    progress.value = utilsH.percentOf(currentPage.value, totalPage.value)
})

const emit = defineEmits(['p-loadmore']);
const handlePageClick = page => {
    page = page <= totalPage.value ? page : currentPage.value
    emit('p-loadmore', { page, size: props.params.size });
};
</script>

<template>
    <div class="f-center f-column">
        <p class="fs-300" :data-current="currentPage">{{ t('paginator.loadmore_info', {currentPage, totalPage } ) }}</p>
        <div class="progressbar | bg-neutral-300 my-10">
            <div class="progressbar-content | h-100 bg-primary" :style="{ width: progress + '%' }"></div>
        </div>
        <button 
            type="button"
            class="btn btn-primary" 
            @click="handlePageClick(currentPage + 1)" 
            :disabled="currentPage === totalPage"
            :title="t('paginator.loadmore_button')"
        >
            {{ t('paginator.loadmore_button') }}
        </button>
    </div>
</template>

<style lang="scss">
.progressbar {
    height: 12px;
    width: 50vw;
    max-width: 300px;
    border-radius: 10px;
    overflow: hidden;

    &-content {
        width: 0;
        transition: width linear 300ms;
        border-radius: 10px;
    }
}
</style>

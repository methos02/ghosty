<script setup>
import { onMounted, ref, watch } from "vue";
import { paginatorHelper as paginatorH } from "@brugmann/vuemann/src/components/deprecated/paginator-helper.js";
import { utilsH } from "@brugmann/vuemann/src/helpers/utils-helper.js";

const props = defineProps({ 
    params : {
        type: Object,
        default: () => { return { total: 0, limit: 10, skip: 0 }}
    },
})

const totalPage = ref()
const currentPage = ref()
const progress = ref()

onMounted(() => {
    currentPage.value = paginatorH.currentPage(props.params.skip, props.params.limit)
    totalPage.value = paginatorH.calculTotalPage(props.params.total, props.params.limit)
    
    progress.value = utilsH.percentOf(currentPage.value, totalPage.value)
})

watch(() => props.params.skip, skip => {
    currentPage.value = (skip / props.params.limit) + 1
    progress.value = utilsH.percentOf(currentPage.value, totalPage.value)
})

watch(() => props.params.total, NewtotalPage => {
    totalPage.value = paginatorH.calculTotalPage(NewtotalPage, props.params.limit)
})

const emit = defineEmits(['p-loadmore']);
const handlePageClick = page_number => {
    page_number = page_number <= totalPage.value ? page_number : currentPage.value
    emit('p-loadmore', { skip: paginatorH.calculSkip(page_number, props.params.limit), limit: props.params.limit });
};
</script>

<template>
    <div class="f-center f-column">
        <p class="fs-300" :data-current="currentPage">Vous êtes sur la page {{ currentPage }} sur {{ totalPage }}</p>
        <div class="progressbar | bg-neutral-300 my-10">
            <div class="progressbar-content | h-100 bg-primary" :style="{ width: progress + '%' }"></div>
        </div>
        <button class="btn btn-primary" @click="handlePageClick(currentPage + 1)" :disabled="currentPage === totalPage">Charger plus</button>
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

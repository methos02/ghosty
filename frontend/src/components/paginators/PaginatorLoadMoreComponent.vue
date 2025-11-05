<script setup>
import { computed } from "vue";
import { t } from '@/services/services-helper.js'

const percentOf = (value, total) => Math.round((value / total) * 100);

const props = defineProps({
    params : { type: Object, required: true }
})

const progress = computed(() => percentOf(props.params.page, props.params.lastPage))

const emit = defineEmits(['p-loadmore']);
const handlePageClick = (page) => {
    const nextPage = page <= props.params.lastPage ? page : props.params.page
    emit('p-loadmore', { page: nextPage, size: props.params.size });
};
</script>

<template>
    <div class="f-center f-column">
        <p class="fs-300" :data-current="params.page">{{ t('paginator.loadmore_info', {currentPage: params.page, totalPage: params.lastPage } ) }}</p>
        <div class="progressbar | bg-neutral-300 my-10">
            <div class="progressbar-content | h-100 bg-primary" :style="{ width: progress + '%' }"></div>
        </div>
        <button
            type="button"
            class="btn btn-primary"
            @click="handlePageClick(params.page + 1)"
            :disabled="params.page === params.lastPage"
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

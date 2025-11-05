<script setup>
import { onMounted, ref, watch } from "vue";
import { paginatorHelper as paginatorH } from "@brugmann/vuemann/src/helpers/paginator-helper.js";
import { utilsH } from "../../helpers/utils-helper.js";

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
    totalPage.value = paginatorH.calculTotalPage(NewtotalPage, props.params.limit)
})

watch(currentPage, currentPage => {
    progress.value = utilsH.percentOf(currentPage, totalPage.value)
})

const emit = defineEmits(['p-range']);
const handleRangeChange = () => {
    const page = currentPage.value > totalPage.value ? Number.parseInt(totalPage.value) : Number.parseInt(currentPage.value)
    emit('p-range', { page, size: props.params.size });
};
const handlePageClick = page => {
    page = Math.min(page, totalPage.value)
    emit('p-range', { page, size: props.params.size });
};
</script>

<template>
    <div class="paginator-range | f-center g-10 mt-30">
        <button 
            aria-label="Page précédente" 
            data-button="previous"
            type="button" 
            class="pointer" 
            @click="handlePageClick(currentPage - 1)" 
            :disabled="currentPage <= 1"
        >
            <i class="fa-solid fa-chevron-left"></i>
        </button>
        <div class="p-relative">
            <span 
                class="paginator-range_indicator"
                :data-current="currentPage"
                :style="{ left: progress + '%' }"
            >
                {{ currentPage }} / {{ totalPage}}
            </span>
            <input 
                min="1"
                :max="totalPage"
                v-model="currentPage"
                type="range" 
                class="paginator-range_input" 
                @change="handleRangeChange"
                :style="{background: `linear-gradient(to right, #582C4D 0%, #582C4D ${ (progress - 0.4) }%, #e2e2e2 ${ (progress - 0.4) }%, #e2e2e2 100%)`}"
            />
        </div>
        <button 
            aria-label="Page suivante" 
            data-button="next"
            type="button" 
            class="pointer" 
            @click="handlePageClick(currentPage + 1)" 
            :disabled="currentPage >= totalPage"
        >
            <i class="fa-solid fa-chevron-right"></i>
        </button>
    </div>
</template>

<style lang="scss">
    @use '../../assets/scss/variables';

    .paginator-range {
        &_indicator {
            position: absolute;
            top: -35px;
            width: max-content;
            transform: translateX(-50%);
            background-color: variables.$neutral-300;
            padding: 5px 15px;
            border-radius: 5px;
        }

        &_input {
            appearance: none;
            height: 12px;
            width: 50vw;
            max-width: 300px;
            border-radius: 10px;

            &::-webkit-slider-thumb {
                appearance: none;
                width: 16px;
                height: 16px;
                background: variables.$primary; /* Couleur du thumb */
                border-radius: 50%; /* Thumb circulaire */
                cursor: pointer;
            }
        }
    }
</style>

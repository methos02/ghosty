<script setup>
import { computed } from "vue";
import { vInfiniteScroll } from '@vueuse/components'

const props = defineProps({
    cb: { type: Function, default: undefined },
    params : { type: Object, required: true }
})

const runCallBack = async () => {
    const nextPage = props.params.page + 1
    if(nextPage > props.params.lastPage) { return }

    await props.cb(nextPage, props.params.size)
}

</script>

<template>
    <div v-infinite-scroll="[runCallBack, { distance: 10 }]" class="paginator-infinite_container">
        <slot></slot>
    </div>
</template>

<style lang="scss">
    .paginator-infinite {
        &_container {
            overflow-y: auto;
            overflow-x: hidden;
        }
    }
</style>

<script setup>
import { useSlots, computed } from "vue";
import { useClipboard } from '@vueuse/core'
import { codeHtml } from "./code-html-functions.js";
import { t } from '@brugmann/vuemann/src/services/services-helper.js'

const slots = useSlots();

const escapedContent = computed(() => {
    const slotContent = slots.default ? slots.default() : [];
    return slotContent
    .map(vnode => codeHtml.stringifyVNode(vnode))
    .join("\n")
    .replaceAll(String.raw`\n`, '\n  ');
})

const { copy, isSupported, copied } = useClipboard({ escapedContent })
</script>

<template>
    <div class="code-container | p-relative border-neutral-300 radius-5">
        <pre class="code-preview" v-text="escapedContent"></pre>
        <button 
            v-if="isSupported"
            class="code-button | color-neutral-700 color-primary-hover pointer d-flex g-15 a-center"
            @click="copy(escapedContent)"
        >
            <span v-if="copied">{{ t('code_html.copied') }}</span>
            <i class="fa-solid fa-copy fs-700"></i>
        </button>
    </div>
</template>

<style lang="scss">
.code-container {
    background: #f8f9fa;

    .code {
        &-preview {
            padding: 0.85rem;
            font-family: "Courier New", Courier, monospace;
            overflow-x: auto;
            font-size: 14px;
        }
        
        &-button {
            position: absolute;
            inset: 20px 20px auto auto;
        }
    }
}
</style>

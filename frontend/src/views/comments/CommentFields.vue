<script setup>
import { t } from '@/services/shortcuts/services-shortcut.js'
import SwitchComponent from '@/services/form/views/inputs/SwitchComponent.vue'
import TextareaComponent from '@/services/form/views/inputs/TextareaComponent.vue'
import { ConfigLoader } from '@/config/config-loader.js'

defineProps({
  formName: { type: String, required: true },
})

const formDatas = defineModel({ type: Object, required: true })
</script>

<template>
  <div class="comment-fields | d-flex f-column g-5">
    <TextareaComponent
      v-model="formDatas.content"
      name="content"
      :label="t('comment_fields.content')"
      :noLabel="true"
      :placeholder="t('comment_fields.placeholder')"
      :maxLength="ConfigLoader.get('comment.contentMaxLength')"
      :autogrow="true"
      :form="formName"
    />

    <div class="comment-fields__footer | d-flex f-wrap j-between a-center g-10">
      <SwitchComponent
        v-model="formDatas.isSpoiler"
        name="isSpoiler"
        :suffix="t('comment_fields.spoiler')"
        :form="formName"
      />

      <div class="comment-fields__actions | d-flex g-10">
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.comment-fields__actions {
  margin-left: auto;
}
</style>

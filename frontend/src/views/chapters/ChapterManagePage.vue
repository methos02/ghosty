<script setup>
import { computed, onMounted, ref } from 'vue'
import Header from '@/views/layout/HeaderComponent.vue'
import LoaderComponent from '@/components/LoaderComponent.vue'
import InputComponent from '@/services/form/views/inputs/InputComponent.vue'
import ChapterBodyFields from '@/views/chapters/ChapterBodyFields.vue'
import ConfirmButton from '@/components/ConfirmButtonComponent.vue'
import { route, router, t } from '@/services/shortcuts/services-shortcut.js'
import { STATUS } from '@/constants/ajax-constants.js'
import { ChapterController } from '@/apis/chapters/controllers/chapter-controller.js'
import { validateChapterForm } from '@/apis/chapters/formRequest/chapter-form-request.js'
import { proofreadingHelper } from '@/core/helpers/proofreading-helper.js'
import { useChapterManageHead } from '@/head/use-chapter-manage-head.js'

const chapterId = Number(route.get('id')) || undefined
const parentId = Number(route.get('parentId')) || undefined

const isEditing = computed(() => chapterId !== undefined)

useChapterManageHead(isEditing)

const datas = ref({})
const chapter = ref()
const parentChapter = ref()
const novelSlug = ref(route.get('slug'))
const publishButton = ref()
const draftButton = ref()

const isPublished = computed(() => chapter.value !== undefined && !chapter.value.isDraft)

const allowance = computed(() => proofreadingHelper.allowanceFor(chapter.value?.content))

const usedChanges = computed(() =>
  proofreadingHelper.changedWords(chapter.value?.content, datas.value.content, allowance.value),
)

const remainingChanges = computed(() => Math.max(0, allowance.value - usedChanges.value))

const exceedsAllowance = computed(() => usedChanges.value > allowance.value)

const loadParentChapter = async id => {
  if (!id) {
    return
  }

  const response = await ChapterController.getById(id)
  if (response.status !== STATUS.SUCCESS) {
    return
  }

  parentChapter.value = response.chapter
}

const loadChapter = async () => {
  const response = await ChapterController.getById(chapterId)
  if (response.status !== STATUS.SUCCESS) {
    return
  }

  chapter.value = response.chapter
  novelSlug.value = response.chapter.novel.slug
  datas.value = {
    title: response.chapter.title,
    content: response.chapter.content,
    summary: response.chapter.summary,
  }

  await loadParentChapter(response.chapter.parentId)
}

const resumeExistingDraft = async () => {
  const response = await ChapterController.drafts({ parentId })
  if (response.status !== STATUS.SUCCESS) {
    return false
  }

  const started = response.chapters[0]
  if (started === undefined) {
    return false
  }

  await router.replace({ name: 'chapter-edit', params: { id: started.id } })
  return true
}

const create = async () => {
  const payload = { ...datas.value, parentId }
  const validation = validateChapterForm(payload)
  if (!validation.valid) {
    return
  }

  const response = await ChapterController.create(novelSlug.value, payload)
  if (response.status !== STATUS.SUCCESS) {
    return
  }

  await leaveForm()
}

const update = async () => {
  const validation = validateChapterForm(datas.value)
  if (!validation.valid) {
    return
  }

  const saved = await ChapterController.update(chapterId, datas.value)
  if (saved.status !== STATUS.SUCCESS) {
    return
  }

  if (datas.value.isDraft || isPublished.value) {
    return
  }

  const published = await ChapterController.publish(chapterId)
  if (published.status !== STATUS.SUCCESS) {
    return
  }

  await leaveForm()
}

const leaveForm = async () => {
  await router.push(
    datas.value.isDraft
      ? { name: 'drafts' }
      : { name: 'novel-detail', params: { slug: novelSlug.value } },
  )
}

const submit = async () => {
  if (isEditing.value) {
    await update()
    return
  }

  await create()
}

const publish = () => {
  datas.value.isDraft = false

  return submit()
}

const saveDraft = () => {
  datas.value.isDraft = true

  return submit()
}

onMounted(async () => {
  if (isEditing.value) {
    await loadChapter()
    return
  }

  if (await resumeExistingDraft()) {
    return
  }

  await loadParentChapter(parentId)
})
</script>

<template>
  <div class="chapter-manage-page | f-column">
    <Header />

    <div class="chapter-manage-page__body | w-xl py-40 px-20">
      <h1 class="fs-700 fw-700 mb-10">
        {{ isEditing ? t('chapter_manage.title_edit') : t('chapter_manage.title_write') }}
      </h1>

      <p
        v-if="parentChapter"
        class="chapter-manage-page__continuing | color-neutral-700 mb-20"
      >
        {{ t('chapter_manage.continuing') }}
        <strong>{{ parentChapter.title }}</strong>
      </p>

      <p
        v-if="!parentChapter && !isEditing"
        class="color-neutral-700 mb-30"
      >
        {{ t('chapter_manage.subtitle') }}
      </p>

      <div
        v-if="isPublished"
        class="chapter-manage-page__warning | bg-neutral-200 radius-10 p-15 mb-20 d-flex f-column g-10"
      >
        <p class="color-neutral-700">{{ t('chapter_manage.published_warning') }}</p>

        <p
          v-if="chapter.isCorrectable"
          class="chapter-manage-page__once | fw-500"
        >
          {{ t('chapter_manage.single_correction') }}
        </p>

        <p
          v-if="!chapter.isCorrectable"
          class="chapter-manage-page__spent | color-danger fw-500"
        >
          {{ t('chapter_manage.correction_spent') }}
        </p>

        <p
          v-if="chapter.isCorrectable && !exceedsAllowance"
          class="chapter-manage-page__remaining | color-neutral-700"
        >
          {{ t('chapter_manage.words_remaining', { remaining: remainingChanges, allowance }) }}
        </p>

        <p
          v-if="chapter.isCorrectable && exceedsAllowance"
          class="chapter-manage-page__exceeded | color-danger fw-500"
        >
          {{ t('chapter_manage.words_exceeded', { allowance }) }}
        </p>
      </div>

      <form
        @submit.prevent="publishButton?.runCallback()"
        class="chapter-manage-page__form | d-flex f-column"
      >
        <div class="form-row">
          <InputComponent
            v-model="datas.title"
            name="title"
            :label="t('chapter_manage.chapter_title')"
            :required="true"
            form="chapter"
          />
        </div>

        <ChapterBodyFields
          v-model:content="datas.content"
          v-model:summary="datas.summary"
        />

        <div class="form-row | d-flex j-center g-20">
          <ConfirmButton
            v-if="isPublished"
            :cb="saveDraft"
            :disabled="exceedsAllowance || !chapter.isCorrectable"
            :question="t('chapter_manage.confirm_correction')"
            buttonClasses="chapter-manage-page__correct | btn btn-primary"
          >
            {{ t('chapter_manage.save_correction') }}
          </ConfirmButton>

          <LoaderComponent
            v-if="!isPublished"
            ref="draftButton"
            :cb="saveDraft"
            buttonType="button"
            buttonClasses="chapter-manage-page__draft | btn btn-primary-alt"
          >
            {{ t('chapter_manage.save_draft') }}
          </LoaderComponent>
          <LoaderComponent
            v-if="!isPublished"
            ref="publishButton"
            :cb="publish"
            buttonType="submit"
            buttonClasses="chapter-manage-page__publish | btn btn-primary"
          >
            {{ t('chapter_manage.submit') }}
          </LoaderComponent>
        </div>
      </form>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.chapter-manage-page {
  min-height: 100vh;

  &__body {
    margin: 0 auto;
    max-width: 800px;
  }
}
</style>

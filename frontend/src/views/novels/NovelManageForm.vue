<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import LoaderComponent from '@/components/LoaderComponent.vue'
import PublishButton from '@/views/chapters/parts/PublishButton.vue'
import InputComponent from '@/services/form/views/inputs/InputComponent.vue'
import SelectComponent from '@/services/form/views/inputs/SelectComponent.vue'
import ChapterBodyFields from '@/views/chapters/ChapterBodyFields.vue'
import { route, router, t } from '@/services/shortcuts/services-shortcut.js'
import { GenreController } from '@/apis/genres/controllers/genre-controller.js'
import { NovelController } from '@/apis/novels/controllers/novel-controller.js'
import { ChapterController } from '@/apis/chapters/controllers/chapter-controller.js'
import { validateNovelForm } from '@/apis/novels/formRequest/novel-form-request.js'
import { ajaxHelper } from '@/core/helpers/ajax-helper.js'

const formDatas = ref({ novel: {}, chapter: {} })
const genres = ref([])
const publishButton = ref()
const draftButton = ref()
const novelSlug = ref()
const drafts = ref([])

const draftId = computed(() => Number(route.get('id')) || undefined)

const selectedDraft = computed({
  get: () => draftId.value,
  set: id => openDraft(id),
})

const loadGenres = async () => {
  const response = await GenreController.list()
  if (!ajaxHelper.isSuccess(response.status)) {
    return
  }

  genres.value = response.genres
}

const loadDrafts = async () => {
  const response = await ChapterController.drafts({ isRoot: true })
  if (!ajaxHelper.isSuccess(response.status)) {
    return
  }

  drafts.value = response.chapters
}

const openDraft = async id => {
  if (id === undefined) {
    await router.push({ name: 'novel-create' })
    return
  }

  await router.push({ name: 'novel-edit', params: { id } })
}

const loadDraft = async () => {
  if (draftId.value === undefined) {
    formDatas.value = { novel: {}, chapter: {} }
    novelSlug.value = undefined
    return
  }

  const response = await ChapterController.getById(draftId.value)
  if (!ajaxHelper.isSuccess(response.status)) {
    return
  }

  novelSlug.value = response.chapter.novel.slug
  formDatas.value = {
    novel: {
      genreId: response.chapter.novel.genreId,
      title: response.chapter.novel.title,
    },
    chapter: {
      title: response.chapter.title,
      content: response.chapter.content,
      summary: response.chapter.summary,
    },
  }
}

const submit = async () => {
  const validation = validateNovelForm(formDatas.value)
  if (!validation.valid) {
    return
  }

  if (draftId.value !== undefined) {
    await saveExisting()
    return
  }

  await createNovel()
}

const createNovel = async () => {
  const response = await NovelController.create({
    novel: formDatas.value.novel,
    chapter: formDatas.value.chapter,
  })
  if (!ajaxHelper.isSuccess(response.status)) {
    return
  }

  if (formDatas.value.chapter.isDraft) {
    await router.push({ name: 'drafts' })
    return
  }

  await router.push({ name: 'novel-detail', params: { slug: response.novel.slug } })
}

const saveExisting = async () => {
  const novel = await NovelController.update(novelSlug.value, formDatas.value.novel)
  if (!ajaxHelper.isSuccess(novel.status)) {
    return
  }

  const chapter = await ChapterController.update(draftId.value, formDatas.value.chapter)
  if (!ajaxHelper.isSuccess(chapter.status)) {
    return
  }

  if (formDatas.value.chapter.isDraft) {
    await router.push({ name: 'drafts' })
    return
  }

  const published = await ChapterController.publish(draftId.value)
  if (!ajaxHelper.isSuccess(published.status)) {
    return
  }

  await router.push({ name: 'novel-detail', params: { slug: novelSlug.value } })
}

const publish = () => {
  formDatas.value.chapter.isDraft = false

  return submit()
}

const saveDraft = () => {
  formDatas.value.chapter.isDraft = true

  return submit()
}

watch(draftId, loadDraft)

onMounted(async () => {
  await loadGenres()
  await loadDraft()
  await loadDrafts()
})
</script>

<template>
  <div class="novel-manage | w-xl py-30 px-20">
    <form
      @submit.prevent="publishButton?.ask()"
      class="novel-manage__form | d-flex f-column"
    >
      <div class="form-row | d-flex g-20">
        <SelectComponent
          v-if="drafts.length > 0"
          v-model="selectedDraft"
          name="draft"
          :label="t('novel_manage.draft_resume')"
          :fixedLabel="true"
          :error="false"
          containerClass="novel-manage__draft-select no-flex"
        >
          <option :value="undefined">
            {{ t('novel_manage.draft_new') }}
          </option>
          <option
            v-for="item in drafts"
            :key="item.id"
            :value="item.id"
          >
            {{ item.novel.title || item.title || t('novel_manage.draft_untitled') }}
          </option>
        </SelectComponent>

        <SelectComponent
          v-model="formDatas.novel.genreId"
          name="genreId"
          :label="t('novel_manage.genre')"
          :required="true"
          containerClass="novel-manage__genre no-flex"
          form="novel"
        >
          <option
            v-for="genre in genres"
            :key="genre.id"
            :value="genre.id"
          >
            {{ genre.label }}
          </option>
        </SelectComponent>

        <InputComponent
          v-model="formDatas.novel.title"
          name="title"
          :label="t('novel_manage.novel_title')"
          :required="true"
          form="novel"
        />
      </div>

      <div class="form-row">
        <InputComponent
          v-model="formDatas.chapter.title"
          name="title"
          :label="t('novel_manage.chapter_title')"
          :required="true"
          form="chapter"
        />
      </div>

      <ChapterBodyFields
        v-model:content="formDatas.chapter.content"
        v-model:summary="formDatas.chapter.summary"
      />

      <div class="form-row | d-flex j-center g-20">
        <LoaderComponent
          ref="draftButton"
          :cb="saveDraft"
          buttonType="button"
          buttonClasses="novel-manage__draft | btn btn-primary-alt"
        >
          {{ t('novel_manage.save_draft') }}
        </LoaderComponent>
        <PublishButton
          ref="publishButton"
          :cb="publish"
          :content="formDatas.chapter.content"
          buttonClasses="novel-manage__publish | btn btn-primary"
        >
          {{ t('novel_manage.submit') }}
        </PublishButton>
      </div>
    </form>
  </div>
</template>

<style lang="scss" scoped>
.novel-manage {
  margin: 0 auto;
  max-width: 1000px;

  &__draft-select {
    width: 200px;
  }

  &__genre {
    width: 180px;
  }

  &__section {
    min-width: 180px;
  }

  &__form :deep(textarea) {
    min-height: 220px;
  }
}
</style>

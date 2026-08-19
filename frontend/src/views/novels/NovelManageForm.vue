<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import LoaderComponent from '@/components/LoaderComponent.vue'
import InputComponent from '@/services/form/views/inputs/InputComponent.vue'
import SelectComponent from '@/services/form/views/inputs/SelectComponent.vue'
import ChapterBodyFields from '@/views/chapters/ChapterBodyFields.vue'
import { route, router, t } from '@/services/shortcuts/services-shortcut.js'
import { STATUS } from '@/constants/ajax-constants.js'
import { GenreController } from '@/apis/genres/controllers/genre-controller.js'
import { NovelController } from '@/apis/novels/controllers/novel-controller.js'
import { ChapterController } from '@/apis/chapters/controllers/chapter-controller.js'
import { validateNovelForm } from '@/apis/novels/formRequest/novel-form-request.js'

const datas = ref({ novel: {}, chapter: {} })
const genres = ref([])
const publishButton = ref()
const draftButton = ref()
const novelSlug = ref()
const drafts = ref([])

const draftId = computed(() => Number(route.get('id')) || undefined)

const draftLabel = draft => draft.novel.title || draft.title || t('novel_manage.draft_untitled')

const selectedDraft = computed({
  get: () => draftId.value,
  set: id => openDraft(id),
})

const loadGenres = async () => {
  const response = await GenreController.list()
  if (response.status !== STATUS.SUCCESS) {
    return
  }

  genres.value = response.genres
}

const loadDrafts = async () => {
  const response = await ChapterController.drafts({ isRoot: true })
  if (response.status !== STATUS.SUCCESS) {
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
    datas.value = { novel: {}, chapter: {} }
    novelSlug.value = undefined
    return
  }

  const response = await ChapterController.getById(draftId.value)
  if (response.status !== STATUS.SUCCESS) {
    return
  }

  novelSlug.value = response.chapter.novel.slug
  datas.value = {
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
  const validation = validateNovelForm(datas.value)
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
    novel: datas.value.novel,
    chapter: datas.value.chapter,
  })
  if (response.status !== STATUS.SUCCESS) {
    return
  }

  if (datas.value.chapter.isDraft) {
    await router.push({ name: 'drafts' })
    return
  }

  await router.push({ name: 'novel-detail', params: { slug: response.novel.slug } })
}

const saveExisting = async () => {
  const novel = await NovelController.update(novelSlug.value, datas.value.novel)
  if (novel.status !== STATUS.SUCCESS) {
    return
  }

  const chapter = await ChapterController.update(draftId.value, datas.value.chapter)
  if (chapter.status !== STATUS.SUCCESS) {
    return
  }

  if (datas.value.chapter.isDraft) {
    await router.push({ name: 'drafts' })
    return
  }

  const published = await ChapterController.publish(draftId.value)
  if (published.status !== STATUS.SUCCESS) {
    return
  }

  await router.push({ name: 'novel-detail', params: { slug: novelSlug.value } })
}

const publish = () => {
  datas.value.chapter.isDraft = false

  return submit()
}

const saveDraft = () => {
  datas.value.chapter.isDraft = true

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
      @submit.prevent="publishButton?.runCallback()"
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
          <option :value="undefined">{{ t('novel_manage.draft_new') }}</option>
          <option
            v-for="item in drafts"
            :key="item.id"
            :value="item.id"
          >
            {{ draftLabel(item) }}
          </option>
        </SelectComponent>

        <SelectComponent
          v-model="datas.novel.genreId"
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
          v-model="datas.novel.title"
          name="title"
          :label="t('novel_manage.novel_title')"
          :required="true"
          form="novel"
        />
      </div>

      <div class="form-row">
        <InputComponent
          v-model="datas.chapter.title"
          name="title"
          :label="t('novel_manage.chapter_title')"
          :required="true"
          form="chapter"
        />
      </div>

      <ChapterBodyFields
        v-model:content="datas.chapter.content"
        v-model:summary="datas.chapter.summary"
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
        <LoaderComponent
          ref="publishButton"
          :cb="publish"
          buttonType="submit"
          buttonClasses="btn btn-primary"
        >
          {{ t('novel_manage.submit') }}
        </LoaderComponent>
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

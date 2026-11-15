<script setup>
import { computed, onMounted, ref } from 'vue'
import { route, t } from '@/services/shortcuts/services-shortcut.js'
import LoaderComponent from '@/components/LoaderComponent.vue'
import NovelCard from '@/views/parts/NovelCard.vue'
import { UserController } from '@/apis/users/controllers/user-controller.js'
import { ajaxHelper } from '@/core/helpers/ajax-helper.js'

const novels = ref([])
const pagination = ref()

const username = computed(() => route.current().value.params.username)

const hasMore = computed(
  () => pagination.value !== undefined && pagination.value.page < pagination.value.lastPage,
)

const load = async (page = 1) => {
  const response = await UserController.listNovels(username.value, page)
  if (!ajaxHelper.isSuccess(response.status)) {
    return
  }

  novels.value = [...novels.value, ...response.novels]
  pagination.value = response.pagination
}

onMounted(() => load())
</script>

<template>
  <section class="profile-novel-list | d-flex f-column g-20">
    <p
      v-if="pagination && novels.length === 0"
      class="profile-novel-list__empty | text-center color-neutral-700 py-40"
    >
      {{ t('profile_novel_list.empty') }}
    </p>

    <ul class="profile-novel-list__grid">
      <li
        v-for="novel in novels"
        :key="novel.id"
      >
        <NovelCard :novel="novel" />
      </li>
    </ul>

    <div
      v-if="hasMore"
      class="d-flex j-center"
    >
      <LoaderComponent
        :cb="load"
        :params="[pagination.nextPage]"
        buttonClasses="profile-novel-list__more | btn btn-primary-alt"
      >
        {{ t('common.see_more') }}
      </LoaderComponent>
    </div>
  </section>
</template>

<style lang="scss" scoped>
.profile-novel-list__grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 20px;
}
</style>

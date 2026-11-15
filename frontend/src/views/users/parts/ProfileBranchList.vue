<script setup>
import { computed, onMounted, ref } from 'vue'
import { route, t } from '@/services/shortcuts/services-shortcut.js'
import LoaderComponent from '@/components/LoaderComponent.vue'
import ProfileChapterItem from '@/views/users/parts/ProfileChapterItem.vue'
import { UserController } from '@/apis/users/controllers/user-controller.js'
import { ajaxHelper } from '@/core/helpers/ajax-helper.js'

const chapters = ref([])
const pagination = ref()

const username = computed(() => route.current().value.params.username)

const hasMore = computed(
  () => pagination.value !== undefined && pagination.value.page < pagination.value.lastPage,
)

const load = async (page = 1) => {
  const response = await UserController.listBranches(username.value, page)
  if (!ajaxHelper.isSuccess(response.status)) {
    return
  }

  chapters.value = [...chapters.value, ...response.chapters]
  pagination.value = response.pagination
}

onMounted(() => load())
</script>

<template>
  <section class="profile-branch-list | d-flex f-column g-10">
    <p class="profile-branch-list__intro | fs-300 color-neutral-700">
      {{ t('profile_branch_list.intro') }}
    </p>

    <p
      v-if="pagination && chapters.length === 0"
      class="profile-branch-list__empty | text-center color-neutral-700 py-40"
    >
      {{ t('profile_branch_list.empty') }}
    </p>

    <ul class="d-flex f-column g-10">
      <li
        v-for="chapter in chapters"
        :key="chapter.id"
      >
        <ProfileChapterItem :chapter="chapter" />
      </li>
    </ul>

    <div
      v-if="hasMore"
      class="d-flex j-center"
    >
      <LoaderComponent
        :cb="load"
        :params="[pagination.nextPage]"
        buttonClasses="profile-branch-list__more | btn btn-primary-alt"
      >
        {{ t('common.see_more') }}
      </LoaderComponent>
    </div>
  </section>
</template>

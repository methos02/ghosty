<script setup>
import { computed, onMounted, ref } from 'vue'
import { flash, t } from '@/services/shortcuts/services-shortcut.js'
import LoaderComponent from '@/components/LoaderComponent.vue'
import { FollowController } from '@/apis/follows/controllers/follow-controller.js'
import { ajaxHelper } from '@/core/helpers/ajax-helper.js'

const follows = ref([])
const pagination = ref()

const hasMore = computed(
  () => pagination.value !== undefined && pagination.value.page < pagination.value.lastPage,
)

const load = async (page = 1) => {
  const response = await FollowController.list(page)
  if (!ajaxHelper.isSuccess(response.status)) {
    return
  }

  follows.value = [...follows.value, ...response.follows]
  pagination.value = response.pagination
}

const unfollow = async follow => {
  const response = await FollowController.unfollow(follow.chapter.id)
  if (!ajaxHelper.isSuccess(response.status)) {
    return
  }

  follows.value = follows.value.filter(followed => followed.chapter.id !== follow.chapter.id)
  flash.successT('followed_branch_list.unfollowed')
}

onMounted(() => load())
</script>

<template>
  <section class="followed-branch-list | d-flex f-column g-10">
    <p
      v-if="pagination && follows.length === 0"
      class="followed-branch-list__empty | text-center color-neutral-700 py-40"
    >
      {{ t('followed_branch_list.empty') }}
    </p>

    <ul class="followed-branch-list__items | d-flex f-column g-10">
      <li
        v-for="follow in follows"
        :key="follow.chapter.id"
        class="followed-branch-list__item | d-flex a-center j-between g-20 bg-neutral-200 radius-10 p-15"
      >
        <div class="d-flex f-column">
          <router-link
            :to="{
              name: 'chapter-read',
              params: { slug: follow.chapter.novel.slug, id: follow.chapter.id },
            }"
            class="followed-branch-list__branch | link-inline"
          >
            {{
              t('followed_branch_list.branch', {
                title: follow.chapter.title,
                author: follow.chapter.author.username,
              })
            }}
          </router-link>
          <span class="fs-300 color-neutral-700">
            {{
              t('followed_branch_list.novel', {
                novel: follow.chapter.novel.title,
                date: follow.followedAtFormat,
              })
            }}
          </span>
        </div>

        <LoaderComponent
          :cb="unfollow"
          :params="[follow]"
          buttonClasses="followed-branch-list__unfollow | btn btn-sm btn-primary-alt"
        >
          {{ t('followed_branch_list.unfollow') }}
        </LoaderComponent>
      </li>
    </ul>

    <div
      v-if="hasMore"
      class="d-flex j-center"
    >
      <LoaderComponent
        :cb="load"
        :params="[pagination.nextPage]"
        buttonClasses="followed-branch-list__more | btn btn-primary-alt"
      >
        {{ t('common.see_more') }}
      </LoaderComponent>
    </div>
  </section>
</template>

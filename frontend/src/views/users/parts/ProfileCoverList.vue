<script setup>
import { computed, onMounted, ref } from 'vue'
import { route, t } from '@/services/shortcuts/services-shortcut.js'
import LoaderComponent from '@/components/LoaderComponent.vue'
import { UserController } from '@/apis/users/controllers/user-controller.js'
import { ajaxHelper } from '@/core/helpers/ajax-helper.js'

const covers = ref([])
const pagination = ref()

const username = computed(() => route.current().value.params.username)

const hasMore = computed(
  () => pagination.value !== undefined && pagination.value.page < pagination.value.lastPage,
)

const load = async (page = 1) => {
  const response = await UserController.listCovers(username.value, page)
  if (!ajaxHelper.isSuccess(response.status)) {
    return
  }

  covers.value = [...covers.value, ...response.covers]
  pagination.value = response.pagination
}

onMounted(() => load())
</script>

<template>
  <section class="profile-cover-list | d-flex f-column g-20">
    <p
      v-if="pagination && covers.length === 0"
      class="profile-cover-list__empty | text-center color-neutral-700 py-40"
    >
      {{ t('profile_cover_list.empty') }}
    </p>

    <ul class="profile-cover-list__grid">
      <li
        v-for="cover in covers"
        :key="cover.id"
        class="profile-cover-list__item | d-flex f-column g-5"
      >
        <router-link
          :to="{ name: 'novel-covers', params: { slug: cover.novel.slug } }"
          class="profile-cover-list__frame | relative overflow-clip radius-5"
        >
          <img
            :src="cover.imageUrl"
            :alt="t('profile_cover_list.image_alt', { novel: cover.novel.title })"
            class="profile-cover-list__image | w-full h-full"
          />
          <span
            v-if="cover.isOfficial"
            class="profile-cover-list__official | badge bg-primary color-neutral-100 fs-200 fw-700"
          >
            {{ t('profile_cover_list.official') }}
          </span>
        </router-link>
        <span class="profile-cover-list__novel | fs-300">{{ cover.novel.title }}</span>
        <span class="fs-300 color-neutral-700">
          {{ t('common.chapter_likes', cover.likeCount) }}
        </span>
      </li>
    </ul>

    <div
      v-if="hasMore"
      class="d-flex j-center"
    >
      <LoaderComponent
        :cb="load"
        :params="[pagination.nextPage]"
        buttonClasses="profile-cover-list__more | btn btn-primary-alt"
      >
        {{ t('common.see_more') }}
      </LoaderComponent>
    </div>
  </section>
</template>

<style lang="scss" scoped>
.profile-cover-list {
  &__grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 20px;
  }

  &__frame {
    display: block;
    aspect-ratio: 16 / 9;
  }

  &__image {
    object-fit: cover;
  }

  &__official {
    position: absolute;
    top: 8px;
    left: 8px;
  }
}
</style>

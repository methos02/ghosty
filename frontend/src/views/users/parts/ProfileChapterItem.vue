<script setup>
import { t } from '@/services/shortcuts/services-shortcut.js'

defineProps({
  chapter: { type: Object, required: true },
})
</script>

<template>
  <article class="profile-chapter-item | d-flex f-column g-5 bg-neutral-200 radius-10 p-15">
    <div class="d-flex a-center f-wrap g-10">
      <router-link
        :to="{ name: 'chapter-read', params: { slug: chapter.novel.slug, id: chapter.id } }"
        class="profile-chapter-item__title | link-inline"
      >
        {{ chapter.title }}
      </router-link>
      <span
        v-if="chapter.isInMainBranch"
        class="profile-chapter-item__main-branch | badge"
      >
        {{ t('common.main_branch') }}
      </span>
      <span
        v-if="chapter.isArchived"
        class="profile-chapter-item__archived | badge badge-warning"
      >
        {{ t('profile_chapter_item.archived') }}
      </span>
    </div>

    <span class="profile-chapter-item__novel | fs-300 color-neutral-700">
      {{
        t('profile_chapter_item.novel', {
          novel: chapter.novel.title,
          date: chapter.publishedAtFormat,
        })
      }}
    </span>

    <span class="profile-chapter-item__counts | fs-300 color-neutral-700">
      {{ t('profile_chapter_item.reads', chapter.readCount) }}
      ·
      {{ t('common.chapter_likes', chapter.likeCount) }}
      ·
      {{ t('profile_chapter_item.continuations', chapter.childrenCount) }}
    </span>
  </article>
</template>

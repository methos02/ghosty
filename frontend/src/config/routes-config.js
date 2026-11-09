import { novelDetailAsyncData } from '@/ssr/async-data/novel-async-data.js'
import {
  chapterReadingAsyncData,
  multiverseAsyncData,
} from '@/ssr/async-data/chapter-async-data.js'

export const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import('@/views/HomePage.vue'),
  },
  {
    path: '/novels/create',
    name: 'novel-create',
    component: () => import('@/views/HomePage.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/novels/create/:id',
    name: 'novel-edit',
    component: () => import('@/views/HomePage.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/me/drafts',
    name: 'drafts',
    component: () => import('@/views/chapters/DraftsPage.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/me/chapters',
    name: 'written-chapters',
    component: () => import('@/views/chapters/WrittenChaptersPage.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/me/notifications',
    name: 'notifications',
    component: () => import('@/views/notifications/NotificationsPage.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/me/readings',
    name: 'readings',
    component: () => import('@/views/readings/ReadingsPage.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/me/favorites',
    name: 'favorites',
    component: () => import('@/views/novels/FavoritesPage.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/moderation',
    name: 'moderation',
    component: () => import('@/views/moderation/ModerationPage.vue'),
    meta: {
      requiresAuth: true,
      roles: ['moderator', 'admin'],
    },
  },
  {
    path: '/moderation/chapters/:id',
    name: 'moderation-chapter',
    component: () => import('@/views/moderation/ModerationChapterPage.vue'),
    meta: {
      requiresAuth: true,
      roles: ['moderator', 'admin'],
    },
  },
  {
    path: '/moderation/comments/:id',
    name: 'moderation-comment',
    component: () => import('@/views/moderation/ModerationCommentPage.vue'),
    meta: {
      requiresAuth: true,
      roles: ['moderator', 'admin'],
    },
  },
  {
    path: '/chapters/:id/edit',
    name: 'chapter-edit',
    component: () => import('@/views/chapters/ChapterManagePage.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/novels/:slug/chapters/:parentId/write',
    name: 'chapter-write',
    component: () => import('@/views/chapters/ChapterManagePage.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/novels/:slug/chapters/:id',
    name: 'chapter-read',
    component: () => import('@/views/chapters/ChapterReaderPage.vue'),
    meta: { asyncData: chapterReadingAsyncData },
  },
  {
    path: '/novels/:slug/multiverse',
    name: 'multiverse',
    component: () => import('@/views/novels/MultiversePage.vue'),
    meta: { asyncData: multiverseAsyncData },
  },
  {
    path: '/novels/:slug',
    name: 'novel-detail',
    component: () => import('@/views/HomePage.vue'),
    meta: { asyncData: novelDetailAsyncData },
  },
]

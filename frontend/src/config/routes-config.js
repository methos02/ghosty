import { novelDetailAsyncData } from '@/apis/novels/ssr/novel-async-data.js'
import {
  chapterReadingAsyncData,
  multiverseAsyncData,
} from '@/apis/chapters/ssr/chapter-async-data.js'

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
    path: '/me/favorites',
    name: 'favorites',
    component: () => import('@/views/novels/FavoritesPage.vue'),
    meta: { requiresAuth: true },
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

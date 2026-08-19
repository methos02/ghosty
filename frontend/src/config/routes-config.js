import { novelDetailAsyncData } from '@/apis/novels/ssr/novel-async-data.js'

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
  },
  {
    path: '/me/favorites',
    name: 'favorites',
    component: () => import('@/views/novels/FavoritesPage.vue'),
  },
  {
    path: '/chapters/:id/edit',
    name: 'chapter-edit',
    component: () => import('@/views/chapters/ChapterManagePage.vue'),
  },
  {
    path: '/novels/:slug/chapters/:parentId/write',
    name: 'chapter-write',
    component: () => import('@/views/chapters/ChapterManagePage.vue'),
  },
  {
    path: '/novels/:slug',
    name: 'novel-detail',
    component: () => import('@/views/HomePage.vue'),
    meta: { asyncData: novelDetailAsyncData },
  },
]

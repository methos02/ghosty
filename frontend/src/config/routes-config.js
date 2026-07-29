import { novelDetailAsyncData } from '@/apis/novels/ssr/novel-async-data.js'

export const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import('@/views/HomePage.vue'),
  },
  {
    path: '/novels/:slug',
    name: 'novel-detail',
    component: () => import('@/views/HomePage.vue'),
    meta: { asyncData: novelDetailAsyncData },
  },
]

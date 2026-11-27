import { novelDetailAsyncData } from '@/ssr/async-data/novel-async-data.js'
import { profileAsyncData } from '@/ssr/async-data/user-async-data.js'
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
    path: '/me/notifications',
    name: 'notifications',
    component: () => import('@/views/notifications/NotificationsPage.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/me/readings',
    component: () => import('@/views/readings/ReadingsPage.vue'),
    meta: { requiresAuth: true },
    children: [
      {
        path: '',
        name: 'readings',
        component: () => import('@/views/readings/parts/ResumeReadingList.vue'),
      },
      {
        path: 'followed',
        name: 'readings-followed',
        component: () => import('@/views/readings/parts/FollowedBranchList.vue'),
      },
      {
        path: 'history',
        name: 'readings-history',
        component: () => import('@/views/readings/parts/ReadingHistoryList.vue'),
      },
    ],
  },
  {
    path: '/me/account',
    component: () => import('@/views/account/AccountPage.vue'),
    meta: { requiresAuth: true },
    children: [
      {
        path: '',
        redirect: { name: 'account-profile' },
      },
      {
        path: 'profile',
        name: 'account-profile',
        component: () => import('@/views/account/AccountProfilePage.vue'),
      },
      {
        path: 'security',
        name: 'account-security',
        component: () => import('@/views/account/AccountSecurityPage.vue'),
      },
      {
        path: 'statistics',
        name: 'account-statistics',
        component: () => import('@/views/account/AccountStatisticsPage.vue'),
      },
    ],
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
    path: '/metrics',
    name: 'metrics',
    component: () => import('@/views/metrics/MetricsPage.vue'),
    meta: {
      requiresAuth: true,
      roles: ['admin'],
    },
  },
  {
    path: '/novels/:slug/covers',
    name: 'novel-covers',
    component: () => import('@/views/covers/NovelCoversPage.vue'),
  },
  {
    path: '/moderation/covers/:id',
    name: 'moderation-cover',
    component: () => import('@/views/moderation/ModerationCoverPage.vue'),
    meta: {
      requiresAuth: true,
      roles: ['moderator', 'admin'],
    },
  },
  {
    path: '/users/:profileSlug',
    component: () => import('@/views/users/ProfilePage.vue'),
    meta: { asyncData: profileAsyncData },
    children: [
      {
        path: '',
        name: 'profile',
        component: () => import('@/views/users/parts/ProfileNovelList.vue'),
      },
      {
        path: 'chapters',
        name: 'profile-chapters',
        component: () => import('@/views/users/parts/ProfileChapterList.vue'),
      },
      {
        path: 'branches',
        name: 'profile-branches',
        component: () => import('@/views/users/parts/ProfileBranchList.vue'),
      },
      {
        path: 'covers',
        name: 'profile-covers',
        component: () => import('@/views/users/parts/ProfileCoverList.vue'),
      },
    ],
  },
  {
    path: '/moderation/users/:id',
    name: 'moderation-user',
    component: () => import('@/views/moderation/ModerationUserPage.vue'),
    meta: {
      requiresAuth: true,
      roles: ['moderator', 'admin'],
    },
  },
  {
    path: '/novels/:slug',
    name: 'novel-detail',
    component: () => import('@/views/HomePage.vue'),
    meta: { asyncData: novelDetailAsyncData },
  },
]

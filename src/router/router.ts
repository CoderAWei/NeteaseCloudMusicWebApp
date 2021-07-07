import { RouteRecordRaw } from 'vue-router'

export const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Layout',
    redirect: 'discover',
    component: () => import('@/layout/index.vue'),
    children: [
      {
        path: 'discover',
        name: 'Discover',
        component: () => import('@/views/Discover/index.vue'),
        meta: { keepAlive: true }
      },
      {
        path: 'podcast',
        name: 'Podcast',
        component: () => import('@/views/Podcast/index.vue'),
        meta: { keepAlive: true }
      },
      {
        path: 'mine',
        name: 'Mine',
        component: () => import('@/views/Mine/index.vue'),
        meta: { keepAlive: true }
      },
      {
        path: 'kGe',
        name: 'KGe',
        component: () => import('@/views/KGe/index.vue'),
        meta: { keepAlive: true }
      },
      {
        path: 'yunCun',
        name: 'YunCun',
        component: () => import('@/views/YunCun/index.vue'),
        meta: { keepAlive: true }
      }
    ]
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/Login/index.vue')
  },
  {
    path: '/search',
    name: 'Search',
    component: () => import('@/views/Discover/components/search.vue')
  },
  {
    path: '/search-result',
    name: 'SearchResult',
    component: () => import('@/views/Discover/components/result.vue')
  },
  {
    path: '/recommend',
    name: 'Recommend',
    component: () => import('@/views/Recommend/index.vue'),
    meta: { keepAlive: true }
  },
  {
    path: '/play',
    name: 'Play',
    component: () => import('@/views/Play/index.vue'),
    meta: { keepAlive: true }
  },
  {
    path: '/toplist',
    name: 'TopList',
    component: () => import('@/views/TopList/index.vue'),
    meta: { keepAlive: true }
  },
  {
    path: '/toplist-detail',
    name: 'TopListDetail',
    component: () => import('@/views/TopList/components/detail.vue'),
    meta: { keepAlive: true }
  }
]

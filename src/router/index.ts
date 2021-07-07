import { createRouter, createWebHistory } from 'vue-router'

import { routes } from './router'

console.log(`VUE_APP_BASE_URL: ${process.env.VUE_APP_BASE_URL}`)

const router = createRouter({
  history: createWebHistory(process.env.VUE_APP_BASE_URL),
  routes
})

router.beforeEach((to, from, next) => {
  if (to.path === '/login') {
    to.query = { redirect: from.path }
    console.log(`登录前的路径：${from.path}`)
    localStorage.setItem('redirect', from.path)
    next()
  } else if (to.path === '/play') {
    to.query = { redirect: from.path }
    console.log(`进入播放前的路径：${from.fullPath}`)
    localStorage.setItem('redirectFromPlay', from.fullPath)
    next()
  } else if (to.path === '/toplist-detail' && from.path !== '/play') {
    to.query = { redirect: from.path }
    console.log(`进入歌单详情页前的路径：${from.fullPath}`)
    localStorage.setItem('redirectFromPlaylist', from.fullPath)
    next()
  } else {
    next()
  }
})

export default router

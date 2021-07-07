import Vue from 'vue'
import './registerServiceWorker'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import router from './router'
import store from './store'
import App from './App.vue'

import http from '@/config/http'

import './assets/style.scss'

Vue.config.productionTip = false
Vue.use(ElementUI)

Vue.prototype.$axios = http

console.log(`现在处于 ${process.env.NODE_ENV} 环境`)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')

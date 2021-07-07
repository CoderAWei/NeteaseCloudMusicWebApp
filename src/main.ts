import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import SvgIcon from '@/components/SvgIcon/index.vue'

import '@/styles/reset.css'
import '@/styles/index.scss'

import loading from '@/directives/loading/index'

import _ from 'lodash'

import {
  Toast,
  Button,
  Sticky,
  List,
  Icon,
  Dialog,
  Swipe,
  SwipeItem,
  Tab,
  Tabs,
  Empty,
  Popup,
  ActionSheet
} from 'vant'

const app = createApp(App)
app.use(store)
app.use(router)

// 引入的vant组件
app.use(Toast)
app.use(Button)
app.use(Sticky)
app.use(List)
app.use(Icon)
app.use(Swipe)
app.use(SwipeItem)
app.use(Tab)
app.use(Tabs)
app.use(Empty)
app.use(Popup)
app.use(ActionSheet)

// 引入的全局组件
app.component('svg-icon', SvgIcon)

app.directive('loading', loading)

// 全局绑定Toast组件
app.config.globalProperties.$Toast = Toast
app.config.globalProperties.$Dialog = Dialog
app.config.globalProperties._debounce = _.debounce

app.mount('#app')

const req = require.context('@/icons/svg', false, /\.svg$/)
const requireAll = (requireContext:any):string => requireContext.keys().map(requireContext)
requireAll(req)

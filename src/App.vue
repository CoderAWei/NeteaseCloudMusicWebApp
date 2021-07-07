<template>
  <router-view v-slot="{ Component }">
      <keep-alive :include="cachedViews">
      <component :is="Component" />
    </keep-alive>
  </router-view>
</template>

<script lang='ts'>
import { defineComponent } from 'vue'
import { UserModule } from './store/modules/user'

export default defineComponent({
  name: '',
  props: {

  },
  setup() {
    const cachedViews = [
      localStorage.isLogin ? 'Recommend' : '',
      'TopList'
    ]
    if (!localStorage.isLogin) UserModule.setLoginStatus(false)

    return {
      cachedViews
    }
  },
  components: {

  }
})
</script>

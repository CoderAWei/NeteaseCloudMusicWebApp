<template>
  <div class='page-container'>
    <div class="main-container">
      <!-- <router-view/> -->
      <router-view v-slot="{ Component }">
         <keep-alive :include="cachedViews">
          <component class="view" :is="Component" />
        </keep-alive>
      </router-view>

      <Tabbar :tabMenu='tabMenu'/>
    </div>
  </div>
</template>

<script lang='ts'>
/**
 * @Author: 徐忠炜
 * @Email: 94393598@qq.com / xzwei0914@gmail.com
 * @Didi: 有什么问题都可以发邮件问我哦
 * @Date: 2021/01/30 16:47
 */
import { defineComponent, ref } from 'vue'
import Tabbar from '@/components/Tabbar/index.vue'

export default defineComponent({
  name: '',
  props: {

  },
  setup() {
    const tabMenu = [
      { id: 1, name: '发现', icon: 'discover', linkto: '/discover' },
      { id: 2, name: '播客', icon: 'podcast', linkto: '/podcast' },
      { id: 3, name: '我的', icon: 'mine', linkto: '/mine' },
      { id: 4, name: 'K歌', icon: 'microphone', linkto: '/kGe' },
      { id: 5, name: '云村', icon: 'yuncun', linkto: '/yunCun' }
    ]

    const cachedViews = ref<string[]>(['Discover', 'Podcast', 'Mine'])

    return {
      tabMenu,
      cachedViews
    }
  },
  components: {
    Tabbar
  }
})
</script>

<style scoped lang="scss">

</style>

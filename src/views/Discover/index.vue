<template>
  <div class="home" v-loading='loading'>
    <!-- 搜索 -->
    <div style="margin: 0 0 20px 0">
      <input class="input" @click="$router.push('/search')" type="text" placeholder="请输入搜索关键词">
    </div>
    <!-- banners -->
    <div class="banner">
      <van-swipe :autoplay="3000" lazy-render >
        <van-swipe-item v-for="item in banners" :key="item.targetId">
          <img :src="item.pic" @click="handleImgClick(String(item.targetId))"/>
        </van-swipe-item>
      </van-swipe>
    </div>

    <van-button type="primary" @click="$router.push('/recommend')">每日推荐</van-button>
    <van-button type="primary" @click="$router.push('/toplist')">排行榜</van-button>
    <!-- <van-button type="primary" @click="$router.push('/login')">登录</van-button> -->
  </div>
</template>

<script lang="ts">
import { defineComponent, getCurrentInstance, ref } from 'vue'
import { GetBanner } from '@/api/discover/index'
import { MusicCanPlay } from '@/api/play'
import { handleGetMusic } from '@/utils'
import { useRouter } from 'vue-router'

export default defineComponent({
  name: 'Discover',
  setup() {
    const ids: number[] = []
    const banners = ref<any>([])
    const loading = ref<boolean>(false)
    const $router = useRouter()
    const instance: any = getCurrentInstance()

    GetBanner().then(res => {
      banners.value = res.banners
      console.log(banners.value)
      banners.value.forEach((item: any) => {
        if (item.targetId !== 0) {
          ids.push(item.targetId)
        }
      })
    })

    const handleImgClick = async(id: string): Promise<void> => {
      try {
        if (parseInt(id) === 0) return

        loading.value = true
        const canplay = await MusicCanPlay({ id })
        console.log(canplay)
        if (canplay.success) { // 当前歌曲有版权
          handleGetMusic(id, ids).then(res => {
            loading.value = false
            $router.push({ path: '/play', query: { id }})
          }).catch(() => { loading.value = false })
        } else {
          // 网易云的查询版权接口好像没有版权直接抛404 所以这个else一般进不来
          instance.appContext.config.globalProperties.$Toast.fail('抱歉，正在争取版权中...')
        }
      } catch (error) {
        loading.value = false
      }
    }

    return {
      banners,
      handleImgClick,
      loading
    }
  },
  components: {}
})
</script>

<style lang="scss" scoped>
.input{
  display: block;
  box-sizing: border-box;
  width: 100%;
  padding: 5px 10px;
  font-size: 12px;
  color: $primary-color;
  border: 1px solid $primary-color;
  border-radius: 15px;
}
.banner{
  img{
    width: 100%;
    height: 100%;
  }
}
</style>

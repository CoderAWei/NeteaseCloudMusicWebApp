<template>
  <div class='container'>
    <!-- 搜索 -->
    <div class="search">
      <svg-icon icon-class="goback" @click="$router.push('/discover')"/>
      <div class="search-box">
        <van-icon name="search" color="#ffb3a7" @click="handleSearch"/>
        <input
          v-model="keywords"
          ref="inputRef"
          class="search-input"
          type="text"
          :placeholder="showKeyword"
        >
      </div>
    </div>

    <!-- 搜索推荐 -->
    <div
      class="suggest modal"
      v-show="isShowSuggest"
      :style="{'background': isMe ? `url('https://cdn.jsdelivr.net/gh/Xzw111222/MyImages/imgs/rhl2.png')`: `url('https://cdn.jsdelivr.net/gh/Xzw111222/MyImages/imgs/juejin_avatar.gif')`}"
    >
      <div
        class="suggest-item"
        @click="handleSuggestItemClick(item.keyword)"
        v-for="item in suggestList"
        :key="item.keyword"
      >
        {{item.keyword}}
      </div>
      <div class="girl" v-if="isMe">↑ 我女朋友诶！她超可爱的！</div>
    </div>

    <!-- 搜索历史 -->
    <div class="search-history">
      <div
        class="del-all"
        v-if="searchHistoryList.length !== 0"
      >
        <svg-icon icon-class='trash' @click="handleDelAllHistory(0)"></svg-icon>
        <svg-icon icon-class='hook' @click="delStatus = 0" v-if="delStatus !== 0"></svg-icon>
      </div>
      <div
      :class="{'history-item': true, 'shake': delStatus !== 0 }"
      v-for="(item, index) in searchHistoryList"
      :key="item"
      @click="handleSuggestItemClick(item)"
      >
        <p class="history-item-keyword">{{item}}</p>
        <span class="del-history" @click.stop="handleDelHistory(index, 1)">
          <van-icon name="cross" size="12" v-if="delStatus !== 0"/>
        </span>
      </div>
    </div>
  </div>
</template>

<script lang='ts'>
/**
 * @Author: 徐忠炜
 * @Email: 94393598@qq.com / xzwei0914@gmail.com
 * @Didi: 有什么问题都可以发邮件问我哦
 * @Date: 2021/03/15 10:04
 */
import { defineComponent, getCurrentInstance, nextTick, ref, watch } from 'vue'
import { GetSearchSuggest, GetSrachDefault } from '@/api/search/index'
import { useRouter } from 'vue-router'
import { SearchHistoryModule } from '@/store/modules/searchHistory'

export default defineComponent({
  name: 'Search',
  props: {

  },
  setup(props, context) {
    const inputRef = ref<any>(null)
    const showKeyword = ref<string>('')
    let realkeyword: string = ''
    const keywords = ref<string>('') // 最后用于搜索的参数
    const suggestList = ref<string[]>([]) // 搜索推荐列表
    const isShowSuggest = ref<boolean>(false)
    const instance: any = getCurrentInstance()
    const $router = useRouter()
    const searchHistoryList = ref<string[]>([])
    const delStatus = ref<number>(0) // 0 - 初始状态。 1 - 删除全部。
    const isMe = ref<boolean>(true) // 搜索建议背景图

    if (!JSON.parse(localStorage.isLogin) || !localStorage.userinfo || JSON.parse(localStorage.userinfo).userId !== 413137853) {
      isMe.value = false
      console.log(isMe.value)
    }

    GetSrachDefault().then(res => {
      showKeyword.value = res.data.showKeyword
      realkeyword = res.data.realkeyword
    })

    searchHistoryList.value = SearchHistoryModule.searchHistory ? SearchHistoryModule.searchHistory : []
    console.log(searchHistoryList.value)

    // 点击搜索
    const handleSearch = () => {
      inputRef.value.value
        ? keywords.value = inputRef.value.value
        : keywords.value = realkeyword
      SearchHistoryModule.setSearchHistory(keywords.value.trim())
      nextTick(() => {
        searchHistoryList.value = SearchHistoryModule.searchHistory
      })
      isShowSuggest.value = false
      $router.push({ path: '/search-result', query: { keyword: keywords.value }})
    }

    // 点击搜索建议
    const handleSuggestItemClick = (keyword: string) => {
      console.log(keyword)
      SearchHistoryModule.setSearchHistory(keyword.trim())
      nextTick(() => {
        searchHistoryList.value = SearchHistoryModule.searchHistory
      })
      isShowSuggest.value = false
      $router.push({ path: '/search-result', query: { keyword }})
    }

    // 删除搜索历史记录
    const handleDelHistory = (index: number, delCount?: number): void => {
      SearchHistoryModule.delSearchHistory({ index, delCount })
      nextTick(() => {
        searchHistoryList.value = SearchHistoryModule.searchHistory
        console.log(searchHistoryList.value)
      })
    }

    // 删除所有搜索历史记录
    const handleDelAllHistory = (index: number): void => {
      if (delStatus.value === 0) {
        delStatus.value = 1
      } else if (delStatus.value === 1) { // 执行删除全部的逻辑
        instance.appContext.config.globalProperties.$Dialog.confirm({
          title: '提示',
          message: '确定要清楚所有历史记录吗？',
          confirmButtonColor: '#ffb3a7'
        }).then(() => {
          SearchHistoryModule.delSearchHistory({ index, delCount: 99 })
          searchHistoryList.value = SearchHistoryModule.searchHistory
          console.log(searchHistoryList.value)
        }).catch(() => {
          instance.appContext.config.globalProperties.$Toast.fail('已取消')
        })
        delStatus.value = 0
      }
    }

    // window.addEventListener('click', (e: MouseEvent) => {
    //   e.stopPropagation()
    //   const className = (e.target as any).className
    //   if (delStatus.value !== 0) {
    //     if (className !== 'del-all' || className !== 'history-item' || className !== 'del-history' || className !== 'history-item-keyword') {
    //       delStatus.value = 0
    //     }
    //   }
    // })

    watch(
      () => keywords.value,
      instance.appContext.config.globalProperties._debounce((newValue: string, oldValue: string) => {
        newValue ? isShowSuggest.value = true : isShowSuggest.value = false
        if (!newValue) return
        GetSearchSuggest({ keywords: newValue, type: 'mobile' }).then((res: any) => {
          if (!res.result.allMatch) isShowSuggest.value = false
          suggestList.value = res.result.allMatch
        })
      }, 300)
    )

    return {
      showKeyword,
      handleSearch,
      inputRef,
      keywords,
      suggestList,
      handleSuggestItemClick,
      isShowSuggest,
      searchHistoryList,
      handleDelHistory,
      handleDelAllHistory,
      delStatus,
      isMe
    }
  },
  components: {

  }
})
</script>

<style scoped lang="scss">
.container{
  padding: 0 10px;
  width: 100%;
  height: 100vh;
}
.search{
  display: flex;
  padding: 10px 0;
  align-items: center;
  justify-content: space-between;
  &-box{
    margin-left: 10px;
    width: 100%;
    position: relative;
    i{
      position: absolute;
      right: 0;
      top: 2px;
    }
  }
  &-input{
    display: block;
    box-sizing: border-box;
    border: none;
    width: 100%;
    color: $primary-color;
    font-size: 14px;
    border-bottom: 1px solid $primary-color;
  }
}
.suggest{
  position: fixed;
  padding: 0 10px;
  top: 36px;
  left: 35px;
  width: calc(100% - 45px);
  padding: 10px;
  box-shadow: 8px 2px 15px rgba($color: $dark-color, $alpha: .2);
  // background: url('../../../../src/assets/images/rhl.png');
  z-index:  10;
  &-item{
    border-bottom: 1px solid $primary-color;
    color: $primary-color;
    padding: 8px 0;
  }
  .girl{
    margin-top: 40px;
    color: $second-color;
    font-size: 18px;
    text-align: center;
  }
}
.search-history{
  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex-wrap: wrap;
  .del-all{
    width: 100%;
    margin-bottom: 10px;
    svg{
      float: right;
      fill: $primary-color;
      &:first-child{
        margin-left: 8px;
      }
      &:last-child{
        margin-right: 8px;
      }
    }
  }
  .history-item{
    background: $primary-color;
    color: $light-color;
    padding: 6px 14px;
    border-radius: 15px;
    margin: 0 10px 10px 0;
    position: relative;
    .del-history{
      position: absolute;
      top: -6px;
      right: -3px;
      display: inline-block;
      width: 16px;
      text-align: center;
      background-color: $second-color;
      border-radius: 50%;
    }
  }
}
.shake{
  animation: shakeDom .7s infinite;
}

@keyframes shakeDom {
  10%{
    transform: rotate(-3deg);
  }
  30%{
    transform: rotate(-5deg);
  }
  50% {
    transform: rotate(0);
  }
  80% {
    transform: rotate(5deg);
  }
  100% {
    transform: rotate(3deg);
  }
}
</style>

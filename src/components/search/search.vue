<template>
  <div class="search-container">
    <goBack :showGoBack='showGoBack'/>
    <div class="search-panel">
      <input type="text" v-model="text" :placeholder="showKeyword" @keyup.enter="search">
      <span v-show="text !== '' " @click="clearInput"><i class="fa fa-close"></i></span>
      <span @click="regularSearch"><i class="fa fa-search"></i></span>
    </div>
    <div class="suggest" :style="{border: suggest.length === 0 ? 'none' : '1px solid #ccc'}" @click="suggestSearch($event)">
      <div class="suggest-single" :data-suggestName='item.keyword' v-for="(item, i) in suggest" :key="i">{{item.keyword}}</div>
    </div>
    <!-- 搜索历史记录 -->
    <div class="history">
      <div class="history-top">
        <div>历史记录</div>
        <div @click="clearHistory"><i class="fa fa-trash-o"></i></div>
      </div>
      <div class="history-bottom" @click="historySearch($event)">
        <span class="tag" v-for="(item, i) in searchHistory" :key="i" :data-historyName='item'>{{item}}</span>
      </div>
    </div>
    <!-- 热搜榜 -->
    <div style="font-size: 12px; font-weight: 700; margin: 10px 0 0 0">热搜榜</div>
    <div class="search-hot">
      <div class="search-hot-single"
      v-for="(item, i) in hotList" :key="item.score"
      :data-searchWord='item.searchWord'
      @click="quickSearch($event)">
        <div class="order" :style="{color: i <= 2 ? 'red' : '#a39f9f'}">{{i + 1}}</div>
        <div class="content">
          <div :class="{name: i <= 2 }">{{item.searchWord}} <span><img :src="item.iconUrl" width="26px"></span></div>
          <div class="des">{{item.content}}</div>
        </div>
        <div class="score">{{item.score}}</div>
      </div>
    </div>
  </div>
</template>

<script>
import goBack from '@components/public/goBack'
export default {
  props: {

  },
  data () {
    return {
      showGoBack: {
        path: '/discover',
        show: 0
      },
      searchHistory: [], // 搜索历史记录
      text: '',
      showKeyword: '', // 输入框默认显示内容
      realkeyword: '', // 实际搜索的内容
      hotList: [],
      suggest: [] // 输入提示建议
    }
  },
  computed: {

  },
  created () {
    sessionStorage.searchHotList ? this.hotList = JSON.parse(sessionStorage.searchHotList) : this.getHotList()
    this.getSearchDefault()
    localStorage.searchHistory ? this.searchHistory = JSON.parse(localStorage.searchHistory) : this.searchHistory = []
  },
  mounted () {

  },
  watch: {
    text: {
      handler (newVal) {
        console.log(newVal)
        if (newVal === '') {
          this.suggest = []
          return
        }
        this.$axios.get(`/search/suggest?keywords=${newVal}&type=mobile`).then(res => {
          if (res.code === 200) {
            console.log(res.result.allMatch)
            this.suggest = res.result.allMatch
          }
        })
      }
    }
  },
  methods: {
    getHotList () {
      this.$axios.get('/search/hot/detail').then(res => {
        this.hotList = res.data
        sessionStorage.setItem('searchHotList', JSON.stringify(this.hotList))
      })
    },
    getSearchDefault () {
      this.$axios.get('/search/default').then(res => {
        if (res.code === 200) {
          this.showKeyword = res.data.showKeyword
          this.realkeyword = res.data.realkeyword
        }
      })
    },
    quickSearch (event) { // 热搜榜点击可以快捷搜索
      const e = event || window.event
      const target = e.currentTarget
      const keywords = target.getAttribute('data-searchWord')
      this.search(keywords)
    },
    regularSearch () { // 点击搜索图标的搜索
      if (this.text === '') {
        this.text = this.realkeyword
      }

      // 将搜索记录存到localStorage里面
      this.searchHistory.push(this.text)
      this.searchHistory = Array.from(new Set(this.searchHistory))
      localStorage.setItem('searchHistory', JSON.stringify(this.searchHistory))

      // 调用搜索接口
      this.search(this.text)
    },
    suggestSearch (event) { // 搜索建议 点击的快捷搜索
      const e = event || window.event
      e.stopPropagation()
      const target = e.target
      const keywords = target.getAttribute('data-suggestname')
      this.search(keywords)
    },
    historySearch (event) { // 历史记录 点击的快捷搜索
      const e = event || window.event
      e.stopPropagation()
      const target = e.target
      const keywords = target.getAttribute('data-historyName')
      this.search(keywords)
    },
    clearHistory () {
      localStorage.removeItem('searchHistory')
      document.querySelector('.history-bottom').innerHTML = ''
      this.text = ''
    },
    clearInput () {
      this.text = ''
      document.querySelector('.history-bottom').innerHTML = ''
    },
    async search (keywords, limit = 20, type = 1) { // 搜索公用方法
      sessionStorage.setItem('searchKeyword', keywords)
      const res = await this.$axios.get(`/search?keywords=${keywords}&limit=${limit}&type=${type}`)
      if (res.code === 200) {
        // 将搜索结果存到sessionStorage里面
        sessionStorage.setItem('searchResult', JSON.stringify(res.result.songs))
        // 将所有结果存到vuex里面
        this.$store.dispatch('setSearchResult', res.result)
        this.$router.push({ name: 'result' })
      }
    }
  },
  components: {
    goBack
  }
}
</script>

<style scoped lang="scss">
.search-container{
  padding: 5%;
}
.search-panel{
  width: 80%;
  padding: 0 5% 0 0;
  position: absolute;
  top: 3%;
  right: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.history{
  width: 100%;
  &-top{
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 12px;
    font-weight: 700;
    i{
      color: #dedede;
      font-size: 14px;
    }
  }
  &-bottom{
    padding: 20px 0 0 0;
    display: flex;
    flex-wrap: wrap;
    .tag{
      padding: 6px 12px;
      border-radius: 14px;
      background-color: #d5d5d5;
      font-size: 12px;
      margin: 0 5px 5px 0;
    }
  }
}
.search-hot{
  margin-top: 10px;
  &-single{
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 13px;
    margin-bottom: 15px;
    .content{
      width: 60%;
      div:nth-child(1) img{
        width: 20px;
        max-height: 14px;
      }
    }
    .name{
      font-weight: 700;
    }
    .des{
      margin-top: 10px;
      font-size: 11px;
      color: #a39f9f
    }
    .score{
      color: #a39f9f;
    }
  }
}
input[type='text']{
  width: 80%;
  padding: 5px 0 3px 5px;
  outline: none;
  border: none;
  border-bottom: 1px solid #ccc;
}
input[type='text']:focus{
  border-bottom: 1px solid #dd001b;
}
.suggest{
  width: 90%;
  z-index: 10;
  position: fixed;
  // left: 40px;
  box-shadow: 3px 5px 7px rgba(0, 0, 0, .2);
  &-single{
    padding: 5px 0 5px 5px;
    background-color: #fff;
  }
}
</style>

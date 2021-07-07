// 排行榜
<template>
<keep-alive>
  <div class="rankinglist">
    <goBack :showGoBack='showGoBack'/>

    <!-- 官方榜 -->
    <h2>官方榜</h2>
    <div class="official">
      <div class="list-single" v-for="(item) in officiallist" :key="item.playCount" :data-name='item.name' :data-listid='item.id' @click.stop="toDetails($event)" ref="single">
        <div class="list-single-left">
          <img :src="item.coverImgUrl" :alt="item.name">
          <span :data-name='item.name'>{{item.updateFrequency}}</span>
        </div>
        <div class="list-single-right">
          <div v-for="(track, index) in item.tracks" :key="index">{{index+1}}. {{track.first}} - {{track.second}}</div>
        </div>
      </div>
    </div>

    <!-- 其他榜单 -->
    <h2>其他榜单</h2>
    <div class="other">
      <div class="list-single" v-for="(item) in otherList" :key="item.playCount" :data-name='item.name' :data-listid='item.id' @click.stop="toDetails($event)" ref="single">
        <div class="list-single-left">
          <img :src="item.coverImgUrl" :alt="item.name">
          <span>{{item.updateFrequency}}</span>
        </div>
      </div>
    </div>
  </div>
</keep-alive>
</template>

<script>
import goBack from '@components/public/goBack.vue'
export default {
  props: {

  },
  data () {
    return {
      showGoBack: {
        title: '排行榜',
        show: 1,
        path: '/discover'
      },
      officiallist: [], // 官方榜
      otherList: [], // 其他榜单
      rankingIndex: {
        云音乐新歌榜: 0,
        云音乐热歌榜: 1,
        网易原创歌曲榜: 2,
        云音乐飙升榜: 3,
        云音乐电音榜: 4,
        UK排行榜周榜: 5,
        美国Billboard周榜: 6,
        KTV嗨榜: 7,
        iTunes榜: 8,
        'Hit FM Top榜': 9,
        日本Oricon周榜: 10,
        韩国Melon排行榜周榜: 11,
        韩国Mnet排行榜周榜: 12,
        韩国Melon原声周榜: 13,
        '中国TOP排行榜(港台榜)': 14,
        '中国TOP排行榜(内地榜)': 15,
        香港电台中文歌曲龙虎榜: 16,
        华语金曲榜: 17,
        中国嘻哈榜: 18,
        '法国 NRJ EuroHot 30周榜': 19,
        台湾Hito排行榜: 20,
        Beatport全球电子舞曲榜: 21,
        云音乐ACG音乐榜: 22,
        云音乐说唱榜: 23,
        云音乐古典音乐榜: 24,
        抖音排行榜: 26,
        新声榜: 27,
        云音乐韩语榜: 28,
        英国Q杂志中文版周榜: 29,
        电竞音乐榜: 30,
        云音乐欧美热歌榜: 31,
        云音乐欧美新歌榜: 32,
        说唱TOP榜: 33
      },
      selectedIndex: ''
    }
  },
  computed: {

  },
  created () {
    this.$axios.get('/toplist/detail').then(res => {
      if (res.code === 200) {
        res.list.forEach(item => {
          if (item.tracks.length !== 0) {
            this.officiallist.push(item)
          } else {
            this.otherList.push(item)
          }
        })
      }
    })
  },
  mounted () {

  },
  watch: {

  },
  methods: {
    toDetails (e) {
      const evn = e || window.event
      const target = evn.currentTarget
      const listId = target.getAttribute('data-listID')
      const listName = target.getAttribute('data-name')
      this.$router.push({ name: 'rankinglist_details', query: { id: listId, name: listName } })
      // Object.keys(this.rankingIndex).forEach(ele => {
      //   if (rankingType === ele) {
      //     this.selectedIndex = this.rankingIndex[ele].toString()
      //     sessionStorage.setItem('rankingListIndex', this.selectedIndex)
      //     sessionStorage.setItem('rankingType', rankingType)
      //     this.$router.push({ name: 'rankinglist_details' })
      //   }
      // })
    }
  },
  components: {
    goBack
  }
}
</script>

<style scoped lang="scss">
.rankinglist{
  height: 100%;
  padding: 5%;
  h2{
    font-size: 16px;
    font-weight: 700;
    margin-bottom: 20px;
  }
}
.official{
  height: auto;
}
.other{
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
}
.list-single{
  margin: 0 0 5% 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 100px;
  &-left{
    width: 100px;
    position: relative;
    height: 100%;
    box-shadow: 2px 10px 10px rgba(0, 0, 0, .3) inset;
    img{
      width: 100%;
      height: 100%;
      z-index: -1;
    }
    span{
      position: absolute;
      color: #fff;
      font-size: 12px;
      bottom: 10px;
      left: 10px;
    }
  }

  &-right{
    width: calc(100% - 120px);
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    div{
      height: 33%;
      color: #7c7979;
      display: flex;
      align-items: center;
      font-size: 12px;
    }
  }
}
</style>

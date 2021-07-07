<template>
  <div class="mine-container">
    <div class="myMusic">
      <div class="likeMusic" @click="$router.push('/mine/like')">
        <div class="icon-like"><i class="fa fa-heart fa-2x"></i></div>
        <div class="like">我喜欢的音乐</div>
      </div>
      <div class="fmMusic" @click="$router.push('/mine/personal_fm')">
        <div class="icon-fm"><i class="fa fa-chrome fa-2x"></i></div>
        <div class="fm">私人FM</div>
      </div>
    </div>
    <p style="font-weight: bold;margin-top: 20px">我的歌单</p>
    <div class="tab">
      <a href="#create">我创建的歌单</a>
      <a href="#collect">我收藏的歌单</a>
    </div>
    <div class="sheet">
      <ul id="create">
        <div class="sheet-content">
          <div class="box" v-for="item in myPlaylist" :key="item.updateTime" :data-id='item.id' @click="toSongSheet($event)">
            <img :src="item.coverImgUrl" :alt="item.name" width="60px">
            <div class="desc">
              <div class="name">{{item.name}}</div>
              <div class="count">{{item.trackCount}}首</div>
            </div>
          </div>
        </div>
      </ul>
      <ul id="collect" ref="roll">
        <div class="sheet-content">
          <div class="box" v-for="item in collectionPlayList" :key="item.updateTime" :data-id='item.id' @click="toSongSheet($event)">
            <img :src="item.coverImgUrl" :alt="item.name" width="60px">
            <div class="desc">
              <div class="name">{{item.name}}</div>
              <div class="count">{{item.trackCount}}首</div>
            </div>
          </div>
        </div>
      </ul>
    </div>
  </div>
</template>

<script>
import BScroll from 'better-scroll'
export default {
  props: {

  },
  data () {
    return {
      userId: 0, // 用户ID
      myPlaylist: [], // 我创建的歌单列表
      collectionPlayList: [] // 我收藏的歌单列表
    }
  },
  computed: {

  },
  created () {
    this.userId = JSON.parse(localStorage.uid)
    this.getSongSheet()
    // http://localhost:3000/playlist/detail?id=588426292 请求歌单详情接口
  },
  mounted () {
    this.initScroll()
  },
  watch: {

  },
  methods: {
    getSongSheet () {
      this.$axios.get(`/user/playlist?uid=${this.userId}`).then(res => {
        if (res.code === 200) {
          res.playlist.filter((item) => {
            item.creator.userId === this.userId ? this.myPlaylist.push(item) : this.collectionPlayList.push(item)
          })
        }
      })
    },
    initScroll () {
      const options = {
        click: true
      }
      this.$nextTick(() => {
        this.scroll = new BScroll(this.$refs.roll, options)
      })
    },
    toSongSheet (event) {
      const e = event || window.event
      const target = e.currentTarget
      const id = target.getAttribute('data-id')
      this.$axios.get(`/playlist/detail?id=${id}`).then(res => {
        if (res.code === 200) {
          const ids = []
          res.playlist.trackIds.forEach(item => ids.push(item.id))
          this.$store.dispatch('setSheetListId', ids)
          this.$router.push('/mine/songSheet')
        }
      })
    }
  },
  components: {

  },
  beforeRouteLeave (to, from, next) {
    localStorage.setItem('routeBeforePlay', (from.path))
    next()
  }
}
</script>

<style scoped lang="scss">
.myMusic{
  display: flex;
  align-items: center;
  justify-content: space-around;
}
.icon-like,
.icon-fm{
  text-align: center;
  margin-bottom: 10px;
  color: #C20C0C;
}
.tab{
  margin: 10px 0;
  a:link,
  a:visited{
    color: #000;
    text-decoration: none;
    font-size: 13px;
    font-weight: bold;
    display: inline-block;
    margin-right: 10px;
  }
  a:hover,
  a:active{
    color: skyblue;
  }
}
.sheet{
  height: 490px;
  overflow: hidden;
  border-bottom: 1px solid #ccc;
  box-sizing: border-box;
  ul{
    height: 100%;
  }
  &-content{
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    .box{
      width: 49%;
      display: flex;
      align-items: center;
      margin-bottom: 10px;
      .desc{
        margin-left: 10px;
      }
      .name{
        font-size: 13px;
      }
      .count{
        margin-top: 5px;
        color: #a39f9f;
        font-size: 12px;
      }
    }
  }
}
</style>

// 播放页面
<template>
<div style="height: 100%">
  <div class="blur-container" :style="{ 'background-image': `url(${playingSong.blurPicUrl})` }">
  </div>
  <div class="play-container">
    <goBack :showGoBack='showGoBack'/>
    <div class="cd" v-show="show" @click="show = !show" ref="cd">
      <img :src="playingSong.blurPicUrl" width="60%">
    </div>
    <div class="lyrics" v-show="!show" @click="show = !show">
      <div class="volume">
        <i class="fa fa-volume-up" v-show="!isMuted" @click.stop.prevent="muted(true)"></i>
        <i class="fa fa-volume-off" v-show="isMuted" @click.stop.prevent="muted(false)"></i>
        <div class="volumeRange"><input type="range" min="0" max="100" v-model="volume" step="1" @input="handleVolumeChange"></div>
      </div>
      <div class="lyrics-container">
        <ul ref="lyricUL">
          <li v-for="(item, i) in lyricsObjArr" :style="{color: lyricIndex === i ? 'skyblue' : '#ded9d9'}" :key="item.uid" :data-index='i' ref="lyric">{{item.lyric}}</li>
        </ul>
      </div>
    </div>

    <!-- 下方控件 -->
    <div class="bottom">
      <div class="bottom-line1">
        <div class="like" @click="toggleLikeMusic" v-show="!like"><i class="fa fa-heart-o"></i></div>
        <div class="like like-yes" @click="toggleLikeMusic(false)" v-show="like"><i class="fa fa-heart"></i></div>
        <div class="download" @click="download"><i class="fa fa-download"></i></div>
        <div class="comment" @click="showComment"><i class="fa fa-commenting-o"></i></div>
      </div>
      <div class="bottom-progress">
        <div class="curTime">{{curTime}}</div>
        <div class="progress" @click="clickProgress($event)" ref="progress">
          <div class="line" :style="{width: `${precent}`}"></div>
          <div class="dot" :style="{left: `${precent}`}" @touchstart='dotStart' @touchmove='dotMove' @touchend='dotEnd'></div>
        </div>
        <div class="allTime">{{allTime}}</div>
      </div>
      <div class="bottom-controls">
        <div class="prev" @click="prevSong"><i class="fa fa-step-backward"></i></div>
        <div class="pause" v-show="isPlaying" @click="pauseSong"><i class="fa fa-pause"></i></div>
        <div class="play" v-show="!isPlaying" @click="playSong"><i class="fa fa-play"></i></div>
        <div class="next" @click="nextSong"><i class="fa fa-step-forward"></i></div>
      </div>
    </div>

    <!-- autio标签 -->
    <audio @timeupdate="updateTime" @canplay="getDuration" @ended="ended" :src="musicUrl" id="audio" ref="audio"></audio>
    <comment :showCommentPanel='showCommentPanel' @getMoreComment='getMoreComment' @likeComment='toggleLikeComment'/>
  </div>
</div>
</template>

<script>
import goBack from '@components/public/goBack'
import comment from '@/components/comment/comment'
export default {
  props: {

  },
  data () {
    return {
      showGoBack: {
        title: '',
        show: 1,
        path: '',
        style: { padding: '5% 0 0 5%', color: '#fff', 'box-sizing': 'border-box' }
      },
      showCommentPanel: {
        show: false
      },
      playingSong: {}, // 正在播放的歌曲信息
      show: true, // 控制cd和lyrics的显示 默认显示cd
      isPlaying: false, // 播放和暂停状态
      musicUrl: '', // 音乐地址
      curTime: '00:00', // 当前播放时间，格式化之后的
      allTime: '00:00', // 当前音频总时长，格式化之后的
      duration: 0, // 音频总时长，单位秒
      currentTime: 0, // 音频当前播放时间， 单位秒
      precent: '0%', // 当前播放进度百分比
      touchInfo: {}, // 原点滑动时的位置信息
      lyrics: {}, // 歌词 中英文
      lyricsObjArr: [], // 处理之后的歌词 包含时间和歌词
      curMsTime: '', // 当前音频播放的时分毫秒
      like: false, // 是否喜欢当前歌曲 默认为不喜欢
      lyricIndex: '0', // 当前显示的歌词
      isMuted: false, // 是否经验 默认不静音
      volume: 100, // 音频音量
      likeList: [],
      playType: 0 // 播放类型 0代表播放单曲 1代表播放歌曲列表
    }
  },
  computed: {

  },
  created () {
    this.playingSong = this.$store.state.songPlayList[JSON.parse(localStorage.curSongPlayIndex)]
    this.playType = this.$store.state.songPlayList.length === 1 ? 0 : 1
    console.log(localStorage.routeBeforePlay)
    this.showGoBack.path = (localStorage.routeBeforePlay)
    this.getLikeList()
    this.loadMusic()
  },
  mounted () {
    this.autoPlaySong()
  },
  watch: {

  },
  methods: {
    getLyrics () { // 显示歌词
      // 请求歌词
      this.$axios.get(`/lyric?id=${this.playingSong.id}`).then(res => {
        if (res.code === 200) {
          if (res.needDesc) { // 当前歌曲没有歌词
            this.lyricsObjArr = [
              { time: 0, lyric: '纯音乐，请欣赏！', uid: 666666 },
              { time: 0, lyric: '我好喜欢你！！！', uid: 520520 }
            ]
          } else {
            const lyrics = {}
            lyrics.lyric = res.lrc.lyric
            lyrics.tlyric = res.tlyric.lyric
            this.lyrics = lyrics
            // 解析歌词
            this.analysisLyrics(this.lyrics)
          }
        }
      })
    },
    getMusicUrl () { // 获取音乐url
      this.$axios.get(`/song/url?id=${this.playingSong.id}`).then(res => {
        if (res.code === 200) {
          if (res.data[0].url === null) {
            this.$message.warning('没有当前歌曲资源，3s后将自动播放下一首歌曲')
            setTimeout(() => {
              this.nextSong()
            }, 3000)
            return
          }
          this.musicUrl = res.data[0].url
        }
      })
    },
    getLikeStatus () { // 获取当前歌曲的喜欢状态
      this.likeList.indexOf(this.playingSong.id) !== -1 ? this.like = true : this.like = false
    },
    getMusicComment (currentPage, limit = 20) {
      let offset
      let url
      if (currentPage > 1) {
        offset = (currentPage - 1) * 20
        url = `/comment/music?id=${this.playingSong.id}&limit=${limit}&offset=${offset}`
      } else {
        url = `/comment/music?id=${this.playingSong.id}&limit=${limit}`
      }
      this.$axios.get(url).then(res => {
        if (res.code === 200) {
          this.showCommentPanel.total = res.total
          this.showCommentPanel.comments = res.hotComments
            ? res.hotComments.concat(res.comments)
            : this.showCommentPanel.comments.concat(res.comments)
          console.log(this.showCommentPanel.comments)
        }
      })
    },
    loadMusic () { // 加载歌曲 - 名称 图片 播放地址
      this.showGoBack.title = `${this.playingSong.songName} - ${this.playingSong.singerName}`
      this.getMusicUrl()
      this.getLyrics()
      this.getLikeStatus()
      this.getMusicComment()
      this.showCommentPanel.show = false
    },
    playSong () { // 手动点击播放歌曲
      const audio = this.$refs.audio
      this.isPlaying = !this.isPlaying
      audio.play()
      this.$refs.cd.classList.add('rotate')
      if (this.$refs.cd.classList.contains('rotatePause')) this.$refs.cd.classList.remove('rotatePause')
    },
    autoPlaySong () { // 自动播放歌曲
      const audio = this.$refs.audio
      audio.autoplay = true
      this.isPlaying = true
      this.$refs.cd.classList.add('rotate')
      if (this.$refs.cd.classList.contains('rotatePause')) this.$refs.cd.classList.remove('rotatePause')
      this.getLikeStatus()
      this.$refs.lyricUL.style.transform = 'translateY(0px)'
    },
    nextSong () { // 播放下一首歌曲
      localStorage.curSongPlayIndex++
      if (localStorage.curSongPlayIndex > this.$store.state.songPlayList.length) localStorage.curSongPlayIndex = 0
      this.playingSong = this.$store.state.songPlayList[JSON.parse(localStorage.curSongPlayIndex)]
      this.loadMusic()
      this.autoPlaySong()
      this.$refs.lyricUL.style.transform = 'translateY(0px)'
    },
    prevSong () { // 播放上一首歌曲
      localStorage.curSongPlayIndex--
      if (localStorage.curSongPlayIndex < 0) localStorage.curSongPlayIndex = this.$store.state.songPlayList.length - 1
      this.playingSong = this.$store.state.songPlayList[JSON.parse(localStorage.curSongPlayIndex)]
      this.loadMusic()
      this.autoPlaySong()
      this.$refs.lyricUL.style.transform = 'translateY(0px)'
    },
    pauseSong () { // 暂停歌曲
      this.isPlaying = !this.isPlaying
      this.$refs.audio.pause()
      this.$refs.cd.classList.add('rotatePause')
    },
    getDuration () { // canplay时获取音频总时长
      this.duration = this.$refs.audio.duration
      this.allTime = this.formatTime(this.$refs.audio.duration)
    },
    updateTime (e) { // timeupdate时获取当前播放时间
      const { currentTime } = e.target
      this.currentTime = currentTime
      this.curTime = this.formatTime(currentTime) === 'undefined' ? '00:00' : this.formatTime(currentTime)
      this.updateProgress(currentTime, this.duration)

      // 匹配歌词
      for (let i = 0; i < this.lyricsObjArr.length; i++) {
        if (this.currentTime > (parseInt(this.lyricsObjArr[i].time))) {
          const index = this.$refs.lyric[i].dataset.index
          if (i === parseInt(index)) {
            this.lyricIndex = i
            this.$refs.lyricUL.style.transform = `translateY(${170 - (30 * (i + 1))}px)`
          }
        }
      }
    },
    formatTime (time) {
      if (time === 0) {
        this.curTime = '00:00'
        return
      }
      const mins = Math.floor(time / 60) < 10 ? `0${Math.floor(time / 60)}` : Math.floor(time / 60)
      const sec = Math.floor(time % 60) < 10 ? `0${Math.floor(time % 60)}` : Math.floor(time % 60)
      return `${mins}:${sec}`
    },
    ended () {
      this.$refs.cd.classList.remove('rotate')
      this.$refs.audio.currentTime = 0
      this.isPlaying = false
      if (this.playType === 0) {
        this.$message.warning('歌曲列表只有这一首 请返回上一级！')
        this.curTime = '00:00'
        return
      }
      if ((JSON.parse(localStorage.curSongPlayIndex) >= this.$store.state.songPlayList.length - 1) || this.$route.query.from === 'fm') {
        this.$router.push('/mine/personal_fm')
        return
      }
      this.nextSong()
      console.log('播放完毕')
    },
    updateProgress (currentTime, duration) { // 更新进度条
      const precent = `${((currentTime / duration) * 100).toFixed(5)}%`
      this.precent = precent
    },
    clickProgress (event) { // 点击进度条时 更新音频时间和进度条
      const e = event || window.event
      const position = e.clientX - e.currentTarget.offsetLeft // 当前点击的位置
      const progressWidth = this.$refs.progress.offsetWidth // 进度条总宽度
      this.$refs.audio.currentTime = ((position / progressWidth) * this.duration)
      this.updateProgress(((position / progressWidth) * this.duration), this.duration)
    },
    dotStart (e) {
      // 点击的初始位置
      this.touchInfo.startX = e.touches[0].pageX - 83
    },
    dotMove (e) {
      // 移动的距离
      let moveX = e.touches[0].pageX - 83
      // 进度条的宽度
      const progressWidth = this.$refs.progress.offsetWidth
      if (moveX >= progressWidth) moveX = progressWidth

      this.$refs.audio.currentTime = ((moveX / progressWidth) * this.duration)
      this.updateProgress(((moveX / progressWidth) * this.duration), this.duration)
    },
    dotEnd (e) {
      this.playSong()
      this.isPlaying = true
    },
    analysisLyrics (lyrics) { // 解析歌词
      const olyrics = lyrics.lyric
      this.lyricsObjArr = this.lyric2ObjArr(olyrics)
    },
    lyric2ObjArr (lyric) {
      const regNewLine = /\n/
      const regTime = /\[\d{2}:\d{2}.\d{2,3}\]/
      const lineArr = lyric.split(regNewLine) // 每行歌词的数组
      const lyricsObjArr = [] // 歌词对象数组 [{time: '', lyric: ''}]
      lineArr.forEach(item => {
        if (item === '') return
        const obj = {}
        const time = item.match(regTime)

        obj.lyric = item.split(']')[1].trim() === '' ? '' : item.split(']')[1].trim()
        obj.time = time ? this.formatLyricTime(time[0].slice(1, time[0].length - 1)) : 0
        obj.uid = Math.random().toString().slice(-6)
        if (obj.lyric === '') {
          console.log('这一行没有歌词')
        } else {
          lyricsObjArr.push(obj)
        }
      })
      return lyricsObjArr
    },
    formatLyricTime (time) { // 格式化歌词的时间 转换成 sss:ms
      const regMin = /.*:/
      const regSec = /:.*\./
      const regMs = /\./

      const min = parseInt(time.match(regMin)[0].slice(0, 2))
      let sec = parseInt(time.match(regSec)[0].slice(1, 3))
      const ms = time.slice(time.match(regMs).index + 1, time.match(regMs).index + 3)
      if (min !== 0) {
        sec += min * 60
      }
      return Number(sec + '.' + ms)
    },
    toggleLikeMusic (like = true) { // like为true表示默认点击喜欢音乐 传入false表示取消喜欢
      like ? this.like = true : this.like = false
      this.$axios.get(`/like?id=${this.playingSong.id}&like=${like}`).then(res => {
        if (res.code === 200) {
          like
            ? this.$message.success('已成功添加到喜欢的音乐')
            : this.$message.success('你抛弃了她！')
        } else {
          this.showLikeErrorMsg(like)
        }
      })
    },
    showLikeErrorMsg (likeStatus) {
      if (likeStatus) {
        this.like = false
        this.$message.error('不好意思，歌曲不喜欢你！')
      } else {
        this.like = true
        this.$message.error('不好意思，她舍不得离开你！')
      }
    },
    showComment () { // 显示评论组件
      this.showCommentPanel.show = !this.showCommentPanel.show
    },
    download () {
      const a = document.createElement('a')
      a.href = this.musicUrl
      a.download = `${this.playingSong.songName} - ${this.playingSong.singerName}`
      a.click()
    },
    muted (status) { // true 表示要调至静音 false 表示要调至最大声
      if (status) {
        this.isMuted = !this.isMuted
        this.$refs.audio.muted = !this.$refs.audio.muted
        this.volume = 0
      } else {
        this.isMuted = !this.isMuted
        this.$refs.audio.muted = !this.$refs.audio.muted
        this.volume = 100
      }
    },
    handleVolumeChange () {
      this.$refs.audio.volume = this.volume / 100
      this.volume / 100 === 0 ? this.isMuted = true : this.isMuted = false
    },
    getMoreComment (currentPage, pageSize) { // 获取更多评论
      this.getMusicComment(currentPage, pageSize)
    },
    toggleLikeComment (id, cid, cIndex) {
      const status = this.showCommentPanel.comments[cIndex].liked // true -- 表示点赞过。false -- 表示未点赞
      if (status) {
        this.$axios.get(`/comment/like?id=${id}&cid=${cid}&t=0&type=0`).then(res => {
          if (res.code === 200) {
            this.showCommentPanel.comments[cIndex].liked = !this.showCommentPanel.comments[cIndex].liked
            this.$message.warning('渣男，你就这样抛弃人家！')
          }
        })
      } else {
        this.$axios.get(`/comment/like?id=${id}&cid=${cid}&t=1&type=0`).then(res => {
          if (res.code === 200) {
            this.showCommentPanel.comments[cIndex].liked = !this.showCommentPanel.comments[cIndex].liked
            this.$message.success('人家超喜欢你的，说话又好听')
          }
        })
      }
    },
    getLikeList () { // 获取喜欢的音乐的ID列表
      this.$axios.get(`/likelist?uid=${JSON.parse(localStorage.uid)}`).then(res => {
        if (res.code === 200) {
          this.likeList = res.ids
        }
      })
    }
  },
  components: {
    goBack,
    comment
  },
  beforeRouteEnter (to, from, next) {
    document.body.scrollTop = 0
    document.documentElement.scrollTop = 0
    next()
  },
  beforeRouteLeave (to, from, next) {
    if (this.isPlaying) { // 播放状态 false为暂停 true为播放
      this.pauseSong()
      setTimeout(() => {
        next()
      }, 20)
    } else {
      next()
    }
  }
}
</script>

<style scoped lang="scss">
.blur-container{
  width: 100%;
  height: 100%;
  background-position: center center;
  background-repeat: no-repeat;
  background-size: cover;
  background-attachment: fixed;
  position: relative;
  z-index: 1;
  filter: blur(50px);
}
.play-container{
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 3;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  background: rgba(0, 0, 0, .2);
}
.cd{
  height: 60%;
  display: flex;
  align-items: center;
  justify-content: center;
  img{
    border-radius: 50%;
  }
}
.cd.rotate img{
  animation: rotateIMG 15s linear infinite;
}
.cd.rotatePause img{
 animation-play-state:paused;
  -webkit-animation-play-state:paused; /* Safari 和 Chrome */
}
.lyrics{
  height: 70%;
  box-sizing: border-box;
  padding: 0 5% 20% 5%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  color: #fff;
  .volume{
    display: flex;
    align-items: center;
    i{
      margin-right: 20px;
    }
    .volumeRange{
      width: 100%;
    }
  }
  &-container{
    height: 75%;
    font-size: 16px;
    overflow: hidden;
    ul{
      text-align: center;
      li{
        color: #ded9d9;
        line-height: 30px;
      }
      li.active{
        color: skyblue;
      }
    }
  }
}
.bottom{
  height: 20%;
  color: #fff;
  &-line1{
    font-size: 30px;
    display: flex;
    align-items: center;
    justify-content: space-around;
    .like-yes{
      i{
        color: #C20C0C;
      }
    }
  }
  &-progress{
    padding: 0 5%;
    margin: 5% 0;
    display: flex;
    align-items: center;
    justify-content: space-between;
    .progress{
      height: 2px;
      background-color: #fff;
      width: 70%;
      position: relative;
      .line{
        position: absolute;
        left: 0;
        top: 0;
        height: 2px;
        background-color: skyblue;
        transition: width .1s;
      }
      .dot{
        width: 14px;
        height: 14px;
        border-radius: 50%;
        position: absolute;
        top: -6px;
        background-color: #ccc;
        transition: left .1s;
      }
    }
  }
  &-controls{
    // padding: 0 5%;
    display: flex;
    align-items: center;
    justify-content: space-around;
    font-size: 30px;
  }
}
</style>

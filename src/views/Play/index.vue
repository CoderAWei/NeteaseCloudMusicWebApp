<template>
  <div class='container brown-bg'>
    <!-- <div class="bg-blur" :style="{backgroundImage:'url(https://p1.music.126.net/Nnzk2I8Jl42yCDL3n9s3FA==/109951165563984995.jpg)' }"></div> -->
    <!-- 头部 -->
    <div class="play-head">
      <div class="play-head-back" @click="handleGoBack"><svg-icon iconClass='goback'/></div>
      <div class="play-head-name">{{playingMusic.name}} - {{playingMusic.artist.name}}</div>
    </div>
    <!-- 旋转头像、歌曲标题部分 以及歌词部分 -->
    <div class="play-middle">
      <div :class="{'songPic': true , 'rotate': isPlaying, 'rotate rotatePause': !isPlaying}" ref="songPic">
        <img :src="`${playingMusic.album.picUrl}?param=${clientHeight < 650 ? '150y150' : '200y200'}`" alt="Album">
      </div>
      <div ref="lyricDiv" class="lyrics">
        <ul ref="lyric" style="transition: .3s">
          <span
            v-for='(item, index) in playingMusic.lyric'
            :key="item.uid"
            :class="{acting: lyricIndex === index}"
            :data-index='index'
          >
            {{item.lyric.trim()}}
          </span>
        </ul>
      </div>
      <div class="toolbar">
        <svg-icon
          :iconClass='modeClass'
          @click="handlePlayMode"
        />
        <svg-icon
          iconClass='like'
          :style="{fill: like ? 'red': ''}"
          @click="handleLikeMusic"
        />
        <div style="position: relative" @click="showComment = !showComment">
          <van-icon
            name="chat-o"
          />
          <span class="totalComment" >{{showTotal}}</span>
        </div>
      </div>
    </div>

    <!-- 播放控制部分 -->
    <div class="play-bottom">
      <!-- 音量控制 -->
      <div class="volume">
        <svg-icon iconClass='volume'/>
        <div class="progress-container">
          <progress-bar
            @progressClick="handleChangeVolume"
            @progressMove="handleChangeVolume"
            :width="volumePercentage"
          />
        </div>
      </div>

      <!-- 上一首 暂停 下一首 -->
      <div class="control">
        <svg-icon @click="handlePrevMusic" class="prev" iconClass='prev'/>
        <svg-icon @click="handleClickPause" class="playing" iconClass='playing' v-if="isPlaying"/>
        <svg-icon @click="handleClickPlay" class="pause" iconClass='pause' v-if="!isPlaying"/>
        <svg-icon @click="handleNextMusic" class="next" iconClass='next'/>
      </div>

      <!-- 进度条 -->
      <div class="progress">
        <div class="currentTime">{{currentTimeStr}}</div>
        <div class="progress-container">
          <progress-bar
            @progressClick="handleClickProgress"
            @progressMove="handleMoveProgress"
            @progressTouch='handleTouchProgress'
            :width="percentage"
          />
        </div>
        <div class="allTime">{{durationStr}}</div>
      </div>
    </div>

    <comment-panel
      ref="commentRef"
      :show='showComment'
      :commentsData='commentsData'
      @close-popup='showComment = !showComment'
      @load="handleLoadMoreComment"
    />

    <audio
      :src="playingMusic.url"
      ref="audio"
      @canplay="handleGetDuration"
      @timeupdate="handleTimeUpdate"
      @ended="handleMusicEnded"
    ></audio>
  </div>
</template>

<script lang='ts'>
/**
 * @Author: 徐忠炜
 * @Email: 94393598@qq.com / xzwei0914@gmail.com
 * @Didi: 有什么问题都可以发邮件问我哦
 * @Date: 2021/02/24 10:05
 */
import { defineComponent, getCurrentInstance, onMounted, ref } from 'vue'
import ProgressBar from './components/ProgressBar.vue'
import Comment from './components/Comment.vue'
import { PlayerModule } from '@/store/modules/player'
import { useRouter } from 'vue-router'
import { handleFormatDuration, handleGetMusic } from '@/utils'
import { ILyric } from '@/typings'
import { GetMusicComment, LikeMusic } from '@/api/play'

export default defineComponent({
  name: 'Play',
  props: {

  },
  setup() {
    const percentage = ref<string>('')
    const volumePercentage = ref<string>('')
    const isPlaying = ref<boolean>(false)
    let playingMusic = ref<any>({})
    const audio = ref<any>(null)
    const lyric = ref<any>(null)
    const lyricDiv = ref<any>(null)
    const durationStr = ref<string>('')
    const currentTimeStr = ref<string>('00:00')
    const clientHeight = ref<number>(0)
    const lyricIndex = ref<number>(0)
    const like = ref<boolean>(false) // 是否是喜欢的歌曲
    let ids: number[] = []
    const $router = useRouter()
    let duration:number = 0
    let currentIndex:number = -1
    let lyricDomArr:any = [] // 歌词dom数组 span标签数组
    let Idx: number = 0 // 这个索引是记录上一次高亮歌词的索引
    let scrollHeight: number = 0 // 歌词区域要滚动的高度
    let lyricHeight: number = 0 // 歌词区域最外层区域高度
    let isTouching: boolean = false // 是否正在拖动歌曲进度条
    let flag: boolean = true // 判断当前高亮的索引是否已经超过了歌词数组的长度
    const playModes = ref<string[]>(['mode_list', 'mode_random', 'mode_single'])
    let modeIndex: number = 0 // 控制播放模式的索引
    const modeClass = ref<string>('') // 播放模式类名，控制svg图片切换
    const showComment = ref<boolean>(false) // 是否显示评论组件
    let currentPage: number = 1 // 评论分页控制
    const pageSize: number = 20 // 评论分页控制
    const showTotal = ref<string>('') // 播放页显示的评论总数
    const commentsData = ref<any>([])
    const commentRef = ref<any>(null)
    const instance: any = getCurrentInstance()

    if (!localStorage.musicVolume) PlayerModule.setMusicVolume(1)

    // 将当前播放歌曲的信息给整出来
    playingMusic = PlayerModule.music
    ids = PlayerModule.music.ids
    currentIndex = PlayerModule.index
    like.value = playingMusic.like

    // 返回
    const handleGoBack = ():void => {
      $router.push(localStorage.redirectFromPlay)
    }

    // 进度条点击事件
    const handleClickProgress = (val: string): void => {
      console.log(`当前点击到的进度: ${val}%`)
      percentage.value = val
      // 更新歌曲
      audio.value.currentTime = duration * (Number(val) / 100)
    }
    // 进度条拖拽事件
    const handleMoveProgress = (val: string): void => {
      console.log(`当前拖拽到的进度: ${val}%`)
      isTouching = true
    }
    // 进度条拖拽结束事件
    const handleTouchProgress = (val: string): void => {
      // 更新歌曲
      audio.value.currentTime = duration * (Number(val) / 100)
    }
    // 播放歌曲
    const handleClickPlay = ():void => {
      console.log('播放')
      isPlaying.value = true
      audio.value.play()
    }
    // 暂停歌曲
    const handleClickPause = (): void => {
      console.log('暂停')
      isPlaying.value = false
      audio.value.pause()
    }
    // 自动播放
    const handleAutoPlay = (): void => {
      audio.value.play()
      isPlaying.value = true
    }
    // 获取歌曲总时长
    const handleGetDuration = (e: any): void => {
      duration = e.target.duration
      durationStr.value = handleFormatDuration(duration)
    }
    // 处理歌曲播放进程
    const handleTimeUpdate = (e:any): void => {
      const { currentTime } = e.target
      currentTimeStr.value = handleFormatDuration(currentTime)
      if (!isTouching) {
        percentage.value = ((currentTime / duration) * 100).toFixed(3).toString()
      }

      handleLyricTransform(currentTime)
    }
    // 处理歌曲播放完时
    const handleMusicEnded = (): void => {
      console.log('歌曲播放完了')
      isPlaying.value = false
      showComment.value = false // 关闭评论区
      // 自动跳转到下一首
      handleNextMusic()
    }
    // 上一首
    const handlePrevMusic = (): void => {
      currentIndex -= 1
      if (currentIndex < 0) currentIndex = ids.length - 1
      PlayerModule.setPlayingMusicIndex(currentIndex)
      const id = ids[currentIndex].toString()
      handleGetMusic(id, ids).then((res: any) => {
        if (!res.url) handlePrevMusic()
        console.log(`跳转到上一首歌 index: ${currentIndex}`)
        playingMusic.artist.name = PlayerModule.music.artist.name
        playingMusic.album.picUrl = PlayerModule.music.album.picUrl
        playingMusic.name = PlayerModule.music.name
        playingMusic.url = PlayerModule.music.url
        playingMusic.lyric = PlayerModule.music.lyric
        audio.value.autoplay = true
        handleGetComment(PlayerModule.music.id)

        // 重置状态
        handleResetMusic()
      })
    }
    // 下一首
    const handleNextMusic = (): void => {
      const id = handleMusicIndex()
      handleGetMusic(id, ids).then((res: any) => {
        if (!res.url) handleNextMusic()
        console.log(`跳转到下一首歌 index: ${currentIndex}, name: ${PlayerModule.music.name}`)
        playingMusic.artist.name = PlayerModule.music.artist.name
        playingMusic.album.picUrl = PlayerModule.music.album.picUrl
        playingMusic.name = PlayerModule.music.name
        playingMusic.url = PlayerModule.music.url
        playingMusic.lyric = PlayerModule.music.lyric
        handleGetComment(PlayerModule.music.id)

        // 重置状态
        handleResetMusic()
      })
    }
    const handleMusicIndex = (): string => {
      switch (modeClass.value) {
        case 'mode_list':
          currentIndex += 1
          if (currentIndex > ids.length - 1) currentIndex = 0
          PlayerModule.setPlayingMusicIndex(currentIndex)
          break
        case 'mode_random':
          currentIndex = Math.ceil(Math.random() * (ids.length - 1))
          PlayerModule.setPlayingMusicIndex(currentIndex)
          break
        case 'mode_single':
      }
      return ids[currentIndex].toString()
    }
    // 音量进度条的点击/拖拽事件
    const handleChangeVolume = (val: string): void => {
      const volume = parseInt(val) / 100
      audio.value.volume = volume
      PlayerModule.setMusicVolume(volume)
      volumePercentage.value = val
    }
    // 歌词滚动
    const handleLyricTransform = (currentTime: number): void => {
      const item: ILyric = playingMusic.lyric[Idx]

      if (flag && currentTime > item.time) {
        lyricDomArr = lyric.value.querySelectorAll('span')
        // 拿到当前正在播放的歌词span的索引
        const index = parseInt(lyricDomArr[Idx].dataset.index)

        if (Idx === index) {
          lyricIndex.value = Idx
          Idx += 1
          if (Idx >= lyricDomArr.length) {
            flag = false
            return
          }

          scrollHeight += lyricDomArr[Idx].offsetHeight
          // console.log(lyricDomArr[Idx], Idx, lyricDomArr[Idx].offsetHeight, currentTime, item.time)
          if (lyric.value) {
            lyric.value.style.transform = `translateY(${lyricHeight - scrollHeight}px)`
          }
        }
      }
    }
    // 重置歌曲状态 跳转之后
    const handleResetMusic = (): void => {
      lyric.value.style.transform = `translateY(0)`
      Idx = 0
      scrollHeight = 0
      flag = true
      audio.value.autoplay = true
      audio.value.play()
      isPlaying.value = true
    }

    // 喜欢歌曲
    const handleLikeMusic = (): void => {
      const id = playingMusic.id
      LikeMusic({ id, like: !like.value }).then(res => {
        if (res.code === 200) {
          if (like.value) {
            like.value = !like.value
            instance.appContext.config.globalProperties.$Toast.fail('你抛弃了他')
          } else {
            like.value = !like.value
            instance.appContext.config.globalProperties.$Toast.success('已添加到我喜欢的音乐列表！')
          }
        }
      })
    }

    // 歌曲播放模式
    const handlePlayMode = () => {
      modeIndex++
      if (modeIndex > playModes.value.length - 1) modeIndex = 0
      modeClass.value = playModes.value[modeIndex]
      console.log(playModes.value[modeIndex])
      switch (modeClass.value) {
        case 'mode_list':
          instance.appContext.config.globalProperties.$Toast({
            message: '列表循环',
            position: 'bottom'
          })
          PlayerModule.setPlayMode('mode_list')
          break
        case 'mode_random':
          instance.appContext.config.globalProperties.$Toast({
            message: '随机播放',
            position: 'bottom'
          })
          PlayerModule.setPlayMode('mode_random')
          break
        case 'mode_single':
          instance.appContext.config.globalProperties.$Toast({
            message: '单曲循环',
            position: 'bottom'
          })
          PlayerModule.setPlayMode('mode_list')
      }
    }

    const handleGetComment = (id: number): void => {
      // 请求评论
      GetMusicComment({ id, limit: pageSize, offset: (currentPage - 1) * pageSize }).then(res => {
        console.log(res)
        showTotal.value = res.showTotal
        commentsData.value = res
      })
    }

    const handleLoadMoreComment = async() => {
      currentPage += 1
      const res: any = await GetMusicComment({ id: playingMusic.id, limit: pageSize, offset: (currentPage - 1) * pageSize })
      if (currentPage !== 1) {
        commentsData.value.comments.push(...res.comments)
      }
      commentRef.value.loading = false

      if (commentsData.value.comments.length > res.total) {
        // 没有更多数据了
        commentRef.value.finished = true
      }
    }

    onMounted(() => {
      handleAutoPlay()
      handleGetComment(playingMusic.id)
      if (!localStorage.playmode) { PlayerModule.setPlayMode('mode_list') }
      modeClass.value = PlayerModule.playMode
      volumePercentage.value = (PlayerModule.volume * 100).toString()
      audio.value.volume = PlayerModule.volume
      clientHeight.value = document.documentElement.clientHeight

      lyricDomArr = lyric.value.querySelectorAll('span')
      lyricHeight = lyricDiv.value.offsetHeight / 2 // 获取固定歌词区域高度的一半 用来让高亮歌词始终居中
    })

    return {
      percentage, // 进度条
      volumePercentage, // 音量进度条
      handleClickProgress,
      handleMoveProgress,
      handleTouchProgress, // 拖拽事件结束
      handleChangeVolume, // 音量进度条点击/拖拽
      handleClickPause,
      handleClickPlay,
      isPlaying, // 是否在播放
      playingMusic, // 当前播放歌曲的信息
      audio, // audio标签 获取dom
      lyric, // 歌词区域 dom
      lyricDiv, // 歌曲区域最外层DIV，主要用来获取高度
      handleGoBack, // 返回上一页
      handleGetDuration, // 获取歌曲总时长
      handleTimeUpdate, // 处理歌曲播放时
      handleMusicEnded, // 处理歌曲播放完时
      durationStr, // 当前歌曲总时长 mm:ss
      currentTimeStr, // 当前歌曲播放事件 mm:ss
      handlePrevMusic, // 上一首
      handleNextMusic, // 下一首
      clientHeight, // 当前页面高度，用来控制专辑图片大小
      lyricIndex, // 当前高亮歌词的索引，用来比对添加高亮样式
      handleLikeMusic,
      like,
      handlePlayMode,
      playModes,
      modeIndex,
      modeClass,
      showComment,
      showTotal, // 展示在页面上的评论总数
      commentsData, // 评论的数据
      handleLoadMoreComment, // 获取更多评论
      commentRef
    }
  },
  components: {
    'progress-bar': ProgressBar,
    'comment-panel': Comment
  }
})
</script>

<style scoped lang="scss">
.container{
  height: 100vh;
  .bg-blur{
    width: 100%;
    height: 100%;
    position: fixed;
    top: 0;
    left: 0;
    z-index: -1;
    filter: blur(35px);
    &::before{
      content: '';
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      background-repeat: no-repeat;
      background-position: center center;
    }
  }
}
.brown-bg{
  background-color: $brown-color;
  color: $light-color;
  padding: 30px 0;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
.play-head{
  height: 10%;
  display: flex;
  align-items: center;
  padding: 0 10px;
  &-back{
    margin-right: 20px;
  }
}
.play-middle{
  height: 70%;
  text-align: center;
  .songPic{
    img{
      border-radius: 50%;
    }
  }
  .lyrics{
    height: 40%;
    padding: 10px;
    overflow: hidden;
    span{
      display: block;
      line-height: 30px;
    }
    .acting{
      color: $primary-color;
      font-size: 18px;
    }
  }
  .toolbar{
    height: 15%;
    display: flex;
    align-items: center;
    justify-content: space-around;
    font-size: 30px;
  }
}
.play-bottom{
  // background-color: $second-color;
  height: 20%;
  padding: 0 10px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  .progress{
    bottom: 0;
    height: 20px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    .currentTime,
    .allTime{
      width: 40px;
    }
    &-container{
      width: calc(100% - 100px);
    }
  }
  .control{
    height: 60px;
    display: flex;
    align-items: center;
    justify-content: space-around;
    svg{
      color: $primary-color;
      font-size: 30px;
    }
    .playing,
    .pause{
      width: 60px;
      height: 60px;
    }
  }
  .volume{
    height: 20px;
    color: $primary-color;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    svg{
      font-size: 20px;
      margin: 0 15px;
    }
  }
}
.totalComment{
  background-color: #373330;
  z-index: 10;
  position: absolute;
  right: -10px;
  font-size: 12px;
  color: $light-color;
  top: -3px;
}
</style>

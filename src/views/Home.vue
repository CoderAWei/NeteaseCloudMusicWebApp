<template>
<div class="home-container">
  <div class="home" @touchstart='touchstart' @touchmove='touchmove'>
    <div class="top">
      <div><span @click="showSideBar"><i class="fa fa-bars"></i></span></div>
      <ul class="navBar" ref="navBar">
        <li><router-link :to="{name: 'mine'}" exact-active-class="nav-active">我的</router-link></li>
        <li><router-link :to="{name: 'discover'}" exact-active-class="nav-active" id="discover">发现</router-link></li>
      </ul>
      <div><router-link :to="{name: 'search'}"><i class="fa fa-search"></i></router-link></div>
    </div>
    <router-view/>
  </div>

  <!-- sideBar组件 -->
  <sideBar ref="bar"/>
  </div>
</template>

<script>
// @ is an alias to /src
import sideBar from '@components/sideBar/sideBar'

export default {
  name: 'Home',
  data () {
    return {
      startX: 0,
      startY: 0,
      moveX: 0,
      moveY: 0
    }
  },
  methods: {
    showSideBar () { // sideBar组件的显示
      this.$refs.bar.showSideBar()
    },
    touchstart (e) {
      // e.preventDefault()
      // console.log(`start: ${e.touches[0].clientX}, ${e.touches[0].clientY}`)
      this.startX = e.touches[0].clientX
      this.startY = e.touches[0].clientY
    },
    touchmove (e) {
      // e.preventDefault()
      this.moveX = e.touches[0].clientX
      this.moveY = e.touches[0].clientY
      this.startX - this.moveX <= 0 ? console.log('你在往右滑') : console.log('你在往左滑')
      if (this.startX <= 80 && (this.startX - this.moveX) <= -100) document.querySelector('.sideBar-container').classList.add('show')
    }
  },
  mounted () {

  },
  components: {
    sideBar
  }
}
</script>

<style lang="scss" scoped>
.nav-active{
  color: rgb(51, 49, 49) !important;
  font-weight: 600;
  font-size: 16px;
}
.home-container{
  width: 100%;
  height: 100%;
}
.touch-panel,
.home{
  width: 100%;
  height: 100%;
  padding: 5% 5% 0 5%;
  box-sizing: border-box;
}
.touch-panel{
  padding: 0;
}
.top{
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
}
.navBar{
  width: 30%;
  display: flex;
  align-items: center;
  justify-content: space-between;

  a:link,
  a:visited{
    text-decoration: none;
    color: #a39f9f;
  }
  a:hover,
  a:active{
    color: rgb(51, 49, 49);
  }
}
</style>

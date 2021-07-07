<template>
  <div class="discover-container">
    <banner/>

    <div class="groups">
      <a href="#/discover/recommend"><div class="circle"><i class="fa fa-calendar"></i></div><p>每日推荐</p></a>
      <a href="javascript:;"><div class="circle"><i class="fa fa-music"></i></div><p>歌单</p></a>
      <a href="#/discover/rankinglist"><div class="circle"><i class="fa fa-bar-chart"></i></div><p>排行榜</p></a>
      <a href="javascript:;"><div class="circle"><i class="fa fa-headphones"></i></div><p>电台</p></a>
    </div>

    <p>看能不能提交代码</p>
  </div>
</template>

<script>
import banner from '@components/discover/banner'
export default {
  props: {

  },
  data () {
    return {

    }
  },
  computed: {

  },
  created () {

  },
  mounted () {

  },
  watch: {

  },
  methods: {

  },
  components: {
    banner
  },
  beforeRouteLeave (to, from, next) {
    localStorage.setItem('routeBeforePlay', 'discover')
    next()
  }
}
</script>

<style scoped lang="scss">

.groups{
  margin-top: 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;

  a{
    display: inline-block;
    width: 50px;
    p{
      font-size: 11px;
      // letter-spacing: 1px;
      margin-top: 5px;
      text-align: center;
    }
  }

  a:link,
  a:visited{
    color: #000;
    text-decoration: none;
  }
  .circle{
    background-color: #dd001b;
    height: 50px;
    border-radius: 50%;
    text-align: center;
    line-height: 50px;

    i{
      color: #fff;
      font-size: 20px;
    }
  }
}
</style>

<template>
  <div class="login">
    <img src="./assets/logo.png" alt="Logo" width="100">
    <h1>网易云音乐</h1>
    <el-form :model="loginForm" :rules="rules">
      <el-form-item label="手机号" prop="phone">
        <el-input v-model="loginForm.phone" type="text" maxlength="11"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input v-model="loginForm.password" type="password"></el-input>
      </el-form-item>
      <el-button class="btn-primary" @click="login">登陆</el-button>
    </el-form>
    <p>没有网易云账号？<router-link to="/register">注册一个</router-link></p>
    <p style="font-size: 13px; color: red">!调用的是官方接口，请放心使用网易云账号登录!</p>
  </div>
</template>

<script>
export default {
  props: {

  },
  data () {
    return {
      loginForm: {},
      rules: {
        phone: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          {
            validator: (rule, value, callback) => {
              if (!((/^1[3456789]\d{9}$/.test(value)))) {
                callback(new Error('请输入正确的手机号'))
              } else {
                callback()
              }
            },
            trigger: 'blur'
          }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' }
        ]
      }
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
    login () {
      console.log(this.loginForm)
      const phone = this.loginForm.phone
      const password = this.loginForm.password
      this.$axios.get(`/login/cellphone?phone=${phone}&password=${password}`).then(res => {
        console.log(res)
        if (res.code === 200) {
          const userInfo = {}
          userInfo.avatarUrl = res.profile.avatarUrl
          userInfo.backgroundUrl = res.profile.backgroundUrl
          userInfo.nickname = res.profile.nickname
          localStorage.setItem('NetEaseCookie', res.cookie)
          localStorage.setItem('NetEaseToken', res.token)
          localStorage.setItem('uid', res.account.id)
          localStorage.setItem('userInfo', JSON.stringify(userInfo))
          this.$router.push('/')
          this.$message.success('登录成功')
        }
      })
    }
  },
  components: {

  }
}
</script>

<style scoped lang="scss">
.login{
  padding: 10%;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
h1{
  margin: 20px 0;
  font-size: 30px;
}
.el-form{
  width: 100%;
}
.btn-primary{
  width: 100%;
  color: #fff;
  background-color: #dd001b;
}
p{
  margin-top: 20px;
  a:link,
  a:visited{
    color: #dd001b;
    text-decoration: none;
  }
  a:hover,
  a:active{
    color: #ca4050;
  }
}
</style>

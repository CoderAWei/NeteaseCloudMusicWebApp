<template>
  <div>
    <div class="register">
    <img src="./assets/logo.png" alt="Logo" width="100">
    <h1>网易云音乐</h1>
    <el-form :model="registerForm" :rules="rules" ref="registerForm" label-width="65px">
      <el-form-item label="手机号" prop="phone">
        <el-input v-model="registerForm.phone" type="text"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input v-model="registerForm.password" type="password"></el-input>
      </el-form-item>
      <el-form-item label="昵称" prop="nickname">
        <el-input v-model="registerForm.nickname"></el-input>
      </el-form-item>
      <el-form-item label="验证码" prop="captcha" class="captcha-container">
        <el-input v-model="registerForm.captcha" class="captcha-text"></el-input>
        <el-button class="captcha" type="primary" plain @click="sendCaptcha">发送验证码</el-button>
      </el-form-item>
      <el-button class="btn-primary" @click="submitForm('registerForm')">注册</el-button>
    </el-form>
  </div>
  </div>
</template>

<script>
export default {
  props: {

  },
  data () {
    return {
      registerForm: {},
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
        ],
        nickname: [
          { required: true, message: '请输入昵称', trigger: 'blur' }
        ],
        captcha: [
          { required: true, message: '请输入验证码', trigger: 'blur' }
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
    sendCaptcha () {
      this.$axios.get(`/captcha/sent?phone=${this.registerForm.phone}`).then(res => {
        if (res.code === 200) {
          this.$message.success('短信已成功发送，请注意查收')
        }
      })
    },
    submitForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.register()
        } else {
          this.$message.error('请按要求填写')
          return false
        }
      })
    },
    async register () {
      const isRegister = await this.$axios.get(`/cellphone/existence/check?phone=${this.registerForm.phone}`)
      console.log(isRegister)
      if (isRegister.exist === 1) {
        this.$message.warning('当前手机号已注册，请登陆')
        this.$router.push('/login')
      } else {
        const isVerify = await this.$axios.get(`/captcha/verify?phone=${this.registerForm.phone}&captcha=${this.registerForm.captcha}`)
        console.log(isVerify)
        if (isVerify.code === 200) {
          const params = {
            captcha: this.registerForm.captcha,
            phone: this.registerForm.phone,
            password: this.registerForm.password,
            nickname: this.registerForm.nickname
          }
          this.$axios.post('/register/cellphone', params).then(res => {
            // 注册
          })
        } else {
          this.$message.error('服务器出错啦，请稍后再试')
        }
      }
    }
  },
  components: {

  }
}
</script>

<style scoped lang="scss">
.register{
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
.captcha-text{
  position: relative;
}
.captcha{
  position: absolute;
  right: 0;
  top: 1px;
}
</style>

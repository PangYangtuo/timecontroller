<template>
  <div class="login-container" :style="{ backgroundImage: `url(${backgroundImage})` }">
    <div class="login-form">
      <h2 class="login-title">中国电子院工时系统</h2>
      <el-form :model="form" ref="form" :rules="rules" label-width="80px" class="form">
        <el-form-item  label="账号" prop="username">
          <el-input v-model="form.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input type="password" v-model="form.password"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="login" style="width:320px">登录</el-button>
        </el-form-item>
      </el-form>
      <div class="login-footer">2023 decided  @By  PYT  to  time Controller v1.0</div>
    </div>
  </div>
</template>

<script>

export default {
  name: 'Login',
  data() {
    return {
      form: {
        username: '',
        password: '',
      },
      rules: {
        username: [{ required: true, message: '请输入账号', trigger: 'blur' }],
        password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
      },
      backgroundImage: require('../assets/th.jpg'),
    };
  },
  methods: {
    login() {
      const account = this.form.username;
      const password = this.form.password;
      const forms = new FormData();
      forms.append('account', account);
      forms.append('password', password)
      // console.log(this.form)
      this.$refs.form.validate(valid => {
        if (valid) {
          // 发送登录请求
          this.$axios.post('/api/searchUser/', forms).then(response => {
            if (response.data === 0){
              localStorage.setItem('account',account)
              this.$router.push("/index")
            }
            else if (response.data === 2){
              localStorage.setItem('account', account)
              this.$router.push('/index')
            }
            else if (response.data === 3){
              localStorage.setItem('account', account)
              this.$router.push('/index')
            }
            else if(response.data === -1){
              alert("数据库中没有此人")
              this.form.username = ''
            }
            else if(response.data === 1){
              alert("密码错误")
              this.form.password = ''
            }
          }).catch(error => {
            alert(error)
          });
        }
      });
    },
  },
};
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-size: cover;
  background-position: center;
}

.login-form {
  width: 400px;
  background-color: rgba(0, 0, 0, 0.5);
  padding: 20px;
  border-radius: 10px;
  color: #fff;
  box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.5);
}

.login-title {
  text-align: center;
  margin-bottom: 20px;
}

.form {
  margin-top: 20px;
}

.login-footer {
  text-align: center;
  margin-top: 20px;
  font-size:2px;
}
</style>

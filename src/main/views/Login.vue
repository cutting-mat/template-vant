<template>
  <div class="flex-col loginPage">
    <div class="_head">
      <img src="../assets/img/logo.png" alt="logo" class="_logo" />
      <h1 class="main-title">隆安晟世信息化管理平台</h1>
    </div>

    <van-form
      ref="validForm"
      :model="formData"
      :rules="rules"
      class="login-form flex-1"
      @submit="login"
    >
      <h2 class="sub-title">
        <span class="_text">请登录</span>
      </h2>
      <van-field
        :autofocus="true"
        label="用户名"
        v-model="formData.account"
        :rules="rules.account"
      ></van-field>
      <van-field
        label="密码"
        type="password"
        v-model.trim="formData.password"
        :rules="rules.password"
      ></van-field>
      <inputCapthaImage ref="validCode" />
      <div class="_action_bar">
        <van-checkbox
          :value="$store.state.rememberLogin"
          @change="$store.set('rememberLogin', $event)"
          >记住我</van-checkbox
        >
      </div>
      <van-cell-group>
        <van-button native-type="submit" block type="primary" :loading="loading"
          >登录</van-button
        >
      </van-cell-group>
    </van-form>
    <div class="footer-info">
      @2022 版权所有 占位文字
      <span class="_s">|</span>
      Github：
      <a href="https://github.com/cutting-mat" target="_blank">cutting-mat</a>
    </div>
  </div>
</template>

<script>
import { event } from "@/core";
import { login } from "@/main/api/common";
import { defineAsyncComponent } from "vue";
const inputCapthaImage = defineAsyncComponent(() =>
  import("../components/InputCaptchaImage.vue")
);
export default {
  components: {
    inputCapthaImage,
  },
  data() {
    const validImage = () => {
      return new Promise((resolve, reject) => {
        if (this.formData.captcha) {
          resolve();
        } else {
          return this.$refs.validCode
            .valid()
            .then((captcha) => {
              this.formData.captcha = captcha;
              resolve();
            })
            .catch(reject);
        }
      });
    };

    return {
      loading: false,
      formData: {
        account: "",
        password: "",
        captcha: "",
      },
      rules: {
        account: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          {
            min: 3,
            max: 30,
            message: "长度在 3 到 30 个字符",
            trigger: "blur",
          },
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          {
            min: 6,
            max: 30,
            message: "长度在 6 到 30 个字符",
            trigger: "blur",
          },
        ],
        captcha: [{ validator: validImage, trigger: "blur" }],
      },
    };
  },
  methods: {
    login() {
      if (this.loading) {
        return null;
      }
      this.loading = true;

      login(this.formData)
        .then((res) => {
          if (res.status === 200) {
            this.loading = false;
            // 登录后全局发布 login 事件, 将被 权限模块 接收
            event.emit("login", {
              redirect: this.$router.currentRoute.value.query.redirect || "/",
              data: res.data,
            });
          } else {
            this.$message({
              message: "登陆失败",
              type: "warning",
            });
          }
        })
        .catch((err) => {
          console.warn(err);
          this.loading = false;
        });
    },
  },
};
</script>

<style scoped>
.loginPage {
  height: 100%;
}
.loginPage ._head {
  height: 30%;
  background: url(../assets/img/bg.png) 0 0 no-repeat;
  background-size: 100% auto;
  color: #fff;
}
.loginPage ._logo {
  display: block;
  margin: 10% auto 10px;
  height: 50%;
}
.main-title {
  font-size: 1.4em;
  margin-bottom: 40px;
  text-align: center;
}
.login-form {
  width: 100%;
  background: #fff;
  border-radius: 10px;
  padding: 20px 2%;
  box-sizing: border-box;
}

.sub-title {
  font-size: 18px;
  font-weight: normal;
  text-align: center;
  color: #257ff7;
  margin-bottom: 20px;
}
.sub-title ._text {
  display: inline-block;
  line-height: 1.4;
  border-bottom: 3px solid #257ff7;
}
.login-form ._action_bar {
  padding: 1em;
}
.footer-info {
  padding: 1em;
  text-align: center;
  font-size: 0.9em;
  color: #999;
}
.footer-info ._s {
  display: inline-block;
  margin: 0 0.5em;
}
</style>

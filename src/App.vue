<template>
  <div id="app">
    <transition :name="transitionName">
      <router-view class="child-view"></router-view>
    </transition>
  </div>
</template>

<script>
import * as util from "@/main/assets/util.js";
import { store } from "@/store";
import { instance } from "@/api";
/**
 * to 如果在这个列表中，始终采用从左到右的滑动效果，首页比较适合用这种方式
 *
 * @type {Array.<string>}
 * @const
 */
const ALWAYS_BACK_PAGE = ["首页"];

/**
 * to 如果在这个列表中，始终采用从右到左的滑动效果
 *
 * @type {Array.<string>}
 * @const
 */
const ALWAYS_FORWARD_PAGE = [];

/**
 * 历史记录，记录访问过的页面的 fullPath
 *
 * @type {Array.<string>}
 */
let HISTORY_STACK = [];

export default {
  data() {
    return {
      transitionName: "",
    };
  },
  watch: {
    $route(to, from) {
      let tn = this.isForward(to, from);
      if (tn.split) {
        this.transitionName = tn;
      } else {
        this.transitionName = tn ? "slide-left" : "slide-right";
      }
    },
  },
  methods: {
    isForward: function (to, from) {
      let res = true;
      if (HISTORY_STACK.length) {
        res = this.isForwardByArray(to, from);
      } else {
        res = "home";
      }
      if (res) {
        // 将 to.fullPath 加到栈顶
        HISTORY_STACK.push(to.fullPath);
      }

      util.storage("HISTORY_ARRAY_STACK_LOCAL_KEY", HISTORY_STACK);

      // to 如果在这个列表中，始终认为是后退
      if (to.name && ALWAYS_BACK_PAGE.indexOf(to.name) !== -1) {
        res = false;
      }
      // 如果在这个列表中，始终认为是前进
      else if (to.name && ALWAYS_FORWARD_PAGE.indexOf(to.name) !== -1) {
        res = true;
      }

      return res;
    },
    isForwardByArray: function (to) {
      // 根据 fullPath 判断当前页面是否访问过，如果访问过，则属于返回

      let index = HISTORY_STACK.indexOf(to.fullPath);
      if (index !== -1) {
        HISTORY_STACK.length = index + 1;
        return false;
      }

      return true;
    },
    
    signin: function (callback) {
      
      /*
       * Step 1
       * 检查用户登录状态
       */
      if (store.get("accessToken")) {
        // 已登录
        instance.defaults.headers.common["Authorization"] =store.get("accessToken");
      } else {
        return console.warn('未登录')
      }
      
      typeof callback === "function" && callback();
    },
    handleLogin: function (res) {
      /*
       * 监听 "login" 事件
       */
      util.storage("auth", res.data);
      store.set("accessToken", res.data.accessToken)

      this.signin(() => {
        // 登录成功（silent来自token续签）
        if (!res.silent) {
          this.initUser(res);
        }
      });
    },
    handleLogout: function () {
      /*
       * 监听 "logout" 事件
       */

      util.storage("auth", "");
      window.location.reload()
    },
    initUser: function (loginRes) {
      if (store.get("accessToken")) {
        store.action("user").then(() => {
          // 如果当前是登录页，跳回首页
          if (loginRes && loginRes.from) {
            this.$router.replace({ path: loginRes.from });
          } 
        });
      }
    },
  },
  created: function () {
    /*
     * Start from here!
     */
    this.signin(this.initUser);

    // global event
    util.on("login", this.handleLogin);
    util.on("logout", this.handleLogout);
  },
};
</script>

<style>
@import url(main/assets/global.css);
</style>

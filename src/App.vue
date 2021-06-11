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
      // 接受url授权
      const url_token = util.getUrlParam('token');
      if(url_token){
        util.storage("auth", {accessToken: url_token});
        util.storage("is_webview", 1);
      }
      /*
       * Step 1
       * Check whether the user has access
       */

      let localUser = util.storage("auth") || {};
      // if (!localUser || !localUser.accessToken) {
      //   return vm.$router.push({
      //     path: "/login",
      //     query: { from: vm.$router.currentRoute.fullPath }
      //   });
      // }

      /*
       * Step 2
       * Set Authorization
       */

      instance.defaults.headers.common["Authorization"] =
        localUser.accessToken || "";
      // Update token info
      store.set("accessToken", localUser.accessToken || "");

      typeof callback === "function" && callback();
    },
    loginDirect: function (res) {
      /*
       * Monitor login events
       * Will trigger the events in views/login.vue
       */
      util.storage("auth", res.data);

      this.signin(() => {
        // 登录成功（silent来自token续签）
        if (!res.silent) {
          this.initUser(res);
        }
      });
    },
    logoutDirect: function () {
      /*
       * Monitor logout events
       * Will trigger the events in views/index.vue
       */

      util.storage("auth", "");

      window.location.href = process.env.BASE_URL || "/";
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
    util.on("login", this.loginDirect);
    util.on("logout", this.logoutDirect);
  },
};
</script>

<style>
@import url(main/assets/style.css);
/* 动画 */
.child-view {
  position: absolute;
  transition: all 0.5s cubic-bezier(0.55, 0, 0.1, 1);
  width: 100%;
  height: 100%;
  box-sizing: border-box;
}
.slide-left-enter,
.slide-right-leave-active {
  opacity: 0;
  -webkit-transform: translate(30px, 0);
  transform: translate(30px, 0);
}
.slide-left-leave-active,
.slide-right-enter {
  opacity: 0;
  -webkit-transform: translate(-30px, 0);
  transform: translate(-30px, 0);
}
</style>

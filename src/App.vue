<template>
  <div id="app">
    <transition :name="transitionName">
      <keep-alive :include="['首页']">
      <router-view class="child-view"></router-view>
      </keep-alive>
    </transition>
  </div>
</template>
<script>
import * as util from "./assets/util.js";
import instance from "./api";
import routers from './router/routers';

/**
 * to 如果在这个列表中，始终采用从左到右的滑动效果，首页比较适合用这种方式
 */
const ALWAYS_BACK_PAGE = [];

/**
 * to 如果在这个列表中，始终采用从右到左的滑动效果
 */
const ALWAYS_FORWARD_PAGE = [];

/**
 * 历史记录，记录访问过的页面的 fullPath
 */
let HISTORY_STACK = [];

export default {
  data() {
    return {
      transitionName: ''
    };
  },
  watch: {
    '$route' (to, from) {
      let tn = this.isForward(to, from);
      if(tn.split){
        this.transitionName = tn
      }else{
        this.transitionName = tn ? 'slide-left' : 'slide-right'
      }
    }
  },
  methods: {
    isForward: function(to, from){
      let res = true;
      if(HISTORY_STACK.length){
        res = this.isForwardByArray(to, from);
      }else{
        res = "home";
      }
      if (res) {
          // 将 to.fullPath 加到栈顶
          HISTORY_STACK.push(to.fullPath);
      }

      util.session("HISTORY_ARRAY_STACK_LOCAL_KEY", HISTORY_STACK);

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
    isForwardByArray: function(to, from) {
        // 根据 fullPath 判断当前页面是否访问过，如果访问过，则属于返回

        let index = HISTORY_STACK.indexOf(to.fullPath);
        if (index !== -1) {
            HISTORY_STACK.length = index + 1;
            return false;
        }
        return true;

    },
    signin: function(localUser) {
      //检查登录状态
      if (!localUser) {
        return console.warn("未登录！");
      }
      //设置请求头统一携带token
      instance.defaults.headers.common["Authorization"] = localUser;
      //注入路由
      this.$router.addRoutes(routers.concat([{
        path: '*',
        redirect: '/404'
      }]));
    },
    getUserToken: function(token){
      let vm = this;
      if(token){
        vm.$root.token = token;
        vm.signin(token);
      }else{
        console.warn('缺少参数');
      }
    }
  },
  created: function() {
    if(!this.$root.token){
      this.getUserToken('b9cdf44483f0c7e0abd51d90109d5dd1');
    }
    
  }
};
</script>
<style>
@import "assets/common.css";
</style>

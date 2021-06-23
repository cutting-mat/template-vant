import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

import FullRoute from "./main/index";

const route = new Router({
  routes: FullRoute
});

// 全局路由钩子
import { store } from "@/store";
import { storage, getUrlParam } from "@/main/assets/util";
// 接受url授权
const url_token = getUrlParam('token');
if(url_token){
  storage("auth", {accessToken: url_token});
}
// 获取用户登录状态
if (!store.get("accessToken")) {
  let localUser = storage("auth") || {};
  if (localUser.accessToken) {
    store.set("accessToken", localUser.accessToken);
  }
}

route.beforeEach((to, from, next) => {
  if (!store.get("accessToken")) {
    if (to.path !== "/login") {
      // 未登录跳转登录页
      let query = {};
      query["from"] = to.fullPath;
      return next({
        path: "/login",
        query
      });
    }
  }

  if (to.name) {
    document.title = to.meta.title || to.name;
  }
  next()
})

export default route

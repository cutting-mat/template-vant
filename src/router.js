import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

import routes from '@/main/index'
const route = new Router({
  routes
});

route.beforeEach((to, from, next) => {
  if(to.name){
    document.title = to.meta.title || to.name;
  }
  next()
})

export default route

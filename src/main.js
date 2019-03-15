import Vue from 'vue'
import './cube-ui'
import Cube from 'cube-ui'
import App from './App'
import router from './router'

import {baseURL} from './api/'

Vue.use(Cube)

Vue.config.productionTip = false

router.beforeEach((to, from, next) => {
  if(to.name){
    document.title = to.name;
  }
  next()
})

/* eslint-disable no-new */
window.globalThis = new Vue({
  el: '#app',
  data(){
    return {
      loading: this.$createToast({
        txt: 'Loading...',
        time: 10000,
        mask: true
      }),
      token: null,
      uploadAction: {
        target: `${baseURL}/index.php/api/file/upload`,
        headers: {
          Authorization: null
        }
      }
    }
  },
  watch: {
    token: function(newToken){
      if(newToken){
        this.uploadAction.headers.Authorization = newToken;
      }
    }
  },
  router,
  render: h => h(App)
})

// 异常处理
Vue.config.errorHandler = function (err, vm, info) {
  console.warn(err, info)
}

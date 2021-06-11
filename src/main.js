// 根据package.json [browserslist]配置加载polyfill，需同时替换babel.config.js中注释的presets配置
// import 'core-js/stable';
// import 'regenerator-runtime/runtime';

import Vue from 'vue'
import Vant from 'vant';
import 'vant/lib/index.css';

Vue.use(Vant);
// 注册全局资源
import register from '@/register'
Vue.use(register);

// 加载路由
import router from './router'

import App from './App.vue'

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')

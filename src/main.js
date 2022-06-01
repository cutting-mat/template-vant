import { createApp } from "vue";

// 加载根组件
import App from "./App.vue";

// 创建应用
const app = createApp(App);

// 创建路由实例
import { routeGenerator } from "@/core";
const routeInstance = routeGenerator({
  beforeEach: (to, from, next) => {
    if (to.name) {
      document.title = to.meta.title || to.name;
    }
    next();
  },
});
app.use(routeInstance);

// 预安装
import preInstall from "@/pre-install";
app.use(preInstall);

// 加载插件
import plugins from "@/core/plugins";
app.use(plugins);

// 挂载应用
app.mount("#app");

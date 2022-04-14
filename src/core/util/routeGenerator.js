import { createRouter, createWebHashHistory } from 'vue-router'

import { BypassRoute } from '@/route.config'

// 路由实例
let routeInstance;

export default function (config) {
  if (!routeInstance) {
    console.log('[Core] Router Start.')

    routeInstance = createRouter({
      scrollBehavior: () => ({ y: 0 }),
      history: createWebHashHistory(),
      routes: BypassRoute
    });

  }

  if (config && config.beforeEach) {
    routeInstance.beforeEach(config.beforeEach)
  }

  return routeInstance
}

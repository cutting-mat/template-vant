/**
 * 状态管理
 * */

import { createPinia } from "pinia";
export const pinia = createPinia();

export const install = function (app) {
  app.use(pinia);
};

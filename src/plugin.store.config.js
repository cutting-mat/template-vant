import { defineStore } from "pinia";
import { permission } from "@/main/api/common";
import { profile } from "@/main/api/personal";
import { pinia } from "@/core/plugins/store";

export const useStore = defineStore("main", {
  state: () => {
    return {
      testValue: 0, // 仅用于测试
      rememberLogin: true, // 记录登录状态
      accessToken: null, // token
      permission: [], // 用户权限
      DynamicRoute: [], // 动态路由
      user: {}, // 用户信息
    };
  },
  actions: {
    testAction: function () {
      return new Promise((resolve) => {
        setTimeout(() => {
          this.testValue++;
          resolve();
        }, 500);
      });
    },
    fetchPermission: async function (payload) {
      const result = await permission(
        null,
        Object.assign(
          {
            cache: true,
          },
          payload || {}
        )
      ).then((res) => {
        return {
          menus: res.data.filter((e) => e.type === 0),
          resources: res.data.filter((e) => e.type === 1),
        };
      });
      this.permission = result;
      return result;
    },
    fetchUser: function (payload) {
      profile(
        null,
        Object.assign(
          {
            cache: true,
          },
          payload || {}
        )
      ).then((res) => {
        this.user = res.data;
      });
    },
  },
});

export const store = useStore(pinia);

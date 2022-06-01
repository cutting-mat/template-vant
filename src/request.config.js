// 各环境BaseURL配置
const ENVIRONMENT = {
  mock: "https://console-mock.apipost.cn/app/mock/project/b9b7920c-6e08-4a21-cb35-33736e292245",
  dev: "http://retire.kaifa/japi",
  test: "http://test.com/api",
  master: "//master.com/api",
};

// 域名与环境映射关系
const HASH = {
  "dev.com": ENVIRONMENT.dev,
  "test.com": ENVIRONMENT.test,
  "master.com": ENVIRONMENT.master,
};

// Axios 请求实例配置
export default {
  baseURL: HASH[window.location.host] || ENVIRONMENT.mock,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
};

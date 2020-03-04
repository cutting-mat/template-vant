import axios from 'axios';
import * as util from '@/common/assets/util';

const URLHASH = {
  mock: 'http://rap2api.taobao.org/app/mock/223572',
  dev:'http://c5app.sogdata.com',
  master: '//master.com'
};

const SERVER = {
  "dev.com": URLHASH.dev,
  "demo.demo": URLHASH.demo,
  "master.com" : URLHASH.master
}

export const baseURL = SERVER[window.location.host] || URLHASH.dev;

export const instance = axios.create({
  baseURL,
  timeout: 10000,
  headers: {
    'Content-Type':'application/json'
  }
});

// 请求处理
instance.interceptors.request.use(function (config) {
  return config;
}, function (error) {
  return Promise.reject(error);
});

//错误处理
instance.interceptors.response.use(function(response) {
  if(response.status!=200){
    return util.catchError(response);
  }
  return response;
}, function (error) {
  return util.catchError(error);
});

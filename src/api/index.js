import axios from 'axios';
import qs from 'qs';
import * as util from '../assets/util.js';


//export const baseURL = 'http://rap2api.taobao.org/app/mock/21999';
export const baseURL = 'http://xiaoqin.sooc.com';

const instance = axios.create({
  baseURL: baseURL,
  timeout: 10000,
  headers: {
    'Content-Type':'application/x-www-form-urlencoded'
  }
});

//instance.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';
// 请求处理
instance.interceptors.request.use(function (config) {
  if(config.data){
    config.data = qs.stringify(config.data)
  }
  return config;
}, function (error) {
  return Promise.reject(error);
});

//错误处理
instance.interceptors.response.use(function(response) {
  if(response.data.status!=200){
    return util.catchError({
      message: response.data.statusCode || '接口请求失败'
    });
  }
  if(!response.data.data){
    return util.catchError({
      message: response.data.statusCode || '接口数据格式异常'
    });
  }
  return response;
}, util.catchError);

export default instance;
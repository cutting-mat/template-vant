import axios from 'axios';
import qs from 'qs';
import * as util from '../assets/util.js';

export const baseURL = '/';

const instance = axios.create({
  baseURL: baseURL,
  timeout: 10000,
  headers: {
    'Content-Type':'application/x-www-form-urlencoded'
  }
});

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
  if(!response.data){
    return util.catchError({
      message: response.data.statusCode || '接口请求失败'
    });
  }
  return response;
}, util.catchError);

export default instance;
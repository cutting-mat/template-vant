/* eslint-disable */
import Vue from 'vue'

//localStorage
export const storage = function(key, value) {
  if (value === void(0)) {
      let lsVal = localStorage.getItem(key);
      if (lsVal && lsVal.indexOf('autostringify-') === 0) {
          return JSON.parse(lsVal.split('autostringify-')[1]);
      } else {
          return lsVal;
      }
  } else {
      if (typeof(value) === "object" || Array.isArray(value)) {
          value = 'autostringify-' + JSON.stringify(value);
      };
      return localStorage.setItem(key, value);
  }
}
//生成随机数
export const getUUID = function (len) {
  len = len || 6;
  len = parseInt(len, 10);
  len = isNaN(len) ? 6 : len;
  var seed = "0123456789abcdefghijklmnopqrstubwxyzABCEDFGHIJKLMNOPQRSTUVWXYZ";
  var seedLen = seed.length - 1;
  var uuid = "";
  while (len--) {
    uuid += seed[Math.round(Math.random() * seedLen)];
  }
  return uuid;
};
//深拷贝
export const deepcopy = function (source) {
  if (!source) {
    return source;
  }
  let sourceCopy = source instanceof Array ? [] : {};
  for (let item in source) {
    sourceCopy[item] = typeof source[item] === 'object' ? deepcopy(source[item]) : source[item];
  }
  return sourceCopy;
};
//日期格式化
export const dateFormat = function(source, ignore_minute) {
  const separate = '-';
  if (!source) {
      source = new Date();
  }

  if (!isNaN(parseInt(source))) {
      //时间戳（秒）
      source = source * 1000
  } else if (source.split) {
      //字符串过滤'-'
      source = source.replace(/\-/g, '/');
  }

  if (new Date(source) && (new Date(source)).getDate) {
      let myDate = new Date(source);
      let minute = '';
      if (!ignore_minute) {
          minute = (myDate.getHours() < 10 ? " 0" : " ") + myDate.getHours() + ":" + (myDate.getMinutes() < 10 ? "0" : "") + myDate.getMinutes();
      }
      return myDate.getFullYear() + separate + (myDate.getMonth() + 1) + separate + (myDate.getDate() < 10 ? '0' : '') + myDate.getDate() + minute;
  } else {
      return source.slice(0, 16);
  }

};
//ajax错误处理
export const catchError = function(error) {
  if(error.data){
    error.response = error.data
  }
  if (error.response) {
    switch (error.response.status) {
      case 400:
      window.globalThis.$createToast({
          type: "error",
          txt: error.response.data.message || '请求参数异常',
          time: 1000
        }).show();
        
        break;
      case 401:
        storage('user','');
        window.location.reload()
        break;
      case 403:
      window.globalThis.$createToast({
          type: "error",
          txt: error.response.data.message || '无访问权限，请联系企业管理员',
          time: 1000
        }).show();
        
        break;
      default:
      window.globalThis.$createToast({
          type: "error",
          txt: error.response.data.message || '服务端异常，请联系技术支持',
          time: 1000
        }).show();
        
    }
  }else if(error.message){
    let message = error.message;
    if(message.indexOf('timeout')>-1){
      message = '请求超时，请重试'
    }
    if(message.indexOf('Network')>-1){
      message = '网络异常'
    }
    window.globalThis.$createToast({
      type: "error",
      txt: message,
      time: 1000
    }).show();
  }
  
  return Promise.reject(error);
}

let bus = new Vue();
//监听事件
export const on = function (eventName, eventHandle) {
  if (eventName && (typeof eventHandle === 'function'))
    return bus.$on(eventName, eventHandle)
};
//触发事件
export const emit = function (eventName, msg) {
  return bus.$emit(eventName, msg)
};

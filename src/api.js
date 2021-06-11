import axios from 'axios';
import * as util from '@/main/assets/util';

const HOST = {
    mock: 'http://rap2.sogdata.com:38080/app/mock/31',
    dev: 'http://zjsz.kaifa/japi',
    test: 'http://zjsz.ceshi/japi',
    bench: 'http://zjsz.bench/japi',
    beta:'http://zjszbeta.sogdata.com/japi',
    backup: '//zjsz.sogdata.com/japi',
    demo: '//demo.shijianyuren.cn/japi',
    master: '//www.shijianyuren.cn/japi'
};

const HASH = { 
    "zjsz.kaifa": HOST.dev,
    "zjsz.ceshi": HOST.test,
    "zjsz.bench": HOST.bench,
    "zjszbeta.sogdata.com":HOST.beta,
    "zjsz.sogdata.com": HOST.backup,
    "demo.shijianyuren.cn": HOST.demo,
    "shijianyuren.cn": HOST.master,
    "www.shijianyuren.cn": HOST.master
}
export const baseURL = HASH[window.location.host] || HOST.dev;

export const instance = axios.create({
    baseURL,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json'
    }
});

// 请求处理
instance.interceptors.request.use(function (config) {
    if(config.method==='get' || config.method==='delete'){
        for(let x in config.params){
            if(config.params[x]===''){
                config.params[x] = null
                console.log(`[${config.method} ${config.url}]参数[${x}]由''重置为null`)
            }
        }
    }
    return config;
}, function (error) {
    return Promise.reject(error);
});

// 响应处理
instance.interceptors.response.use(function (response) {
    if (response.status != 200) {
        return util.catchError(response);
    }
    if(response.data.code === 500 && response.data.msg) {
        // 业务失败抛错
        return util.catchError({response})
    }
    // token续期
    if (response.headers['jwt-update-token']) {
        util.emit('login', {
            silent: true,
            data: {
                accessToken: response.headers['jwt-update-token']
            }
        })
    }
    return response;
}, function (error) {
    return util.catchError(error);
});
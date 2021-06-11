import {
    instance,
    baseURL
} from '@/api';


//上传图片base64
export const uploadImg = params => {
    return instance.post(`/file/upload/base64`, params)
}

//文件上传
export const upload = params => {
    return instance.post(`${baseURL}/file/upload`, params, {
        headers: { "Content-Type": "multipart/form-data" }
    })
}

// 注册账号
export const regist = params => {
    return instance.post(`/sysFrontAccount/register/noAuth`, params)
}

// 发送验证码
export const getValidCode = params => {
    return instance.post(`/sysFrontAccount/verifyCode/noAuth`, params)
}

// 所有学校列表(无需登录)
export const allSchools = params => {
    return instance.get(`/org/school/s/noAuth`, { params })
}

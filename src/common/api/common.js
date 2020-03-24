import {
    instance
} from '@/api';


//上传图片base64
export const uploadImg = params => {
    return instance.post(`/public/file/upload/base64`, params)
}

//文件上传地址
export const upload = params => {
    return instance.post(`/public/file/upload`, params, {
        headers: {'Content-Type':'multipart/form-data'}
    })
}

// 下载文件
export const download = url => {
    return instance.get(`${url}`, {params: {}, responseType: 'blob'})
}

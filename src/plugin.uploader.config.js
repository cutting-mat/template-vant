/**
 * @cutting-mat/uploader 配置文件 
 * 支持 el-upload 除请求相关（action, headers, data, name, with-credentials, http-request）以外的所有Props
 * 附 el-upload 文档: https://element.eleme.cn/#/zh-CN/component/upload
 * 
 * 额外支持以下属性，均支持全局配置：

 * accept[String]:              允许上传的文件类型, 同el-upload, 额外支持自定义文件类型（见下方 quickType ）
 * v-model / value[Array]:      已上传文件数据, 同el-upload, default: []
 * beforeUpload[Function]:      上传文件之前的钩子，同el-upload, 将作为默认配置，可以被组件配置覆盖
 * onExceed[Function]:          文件超出个数限制时的钩子, 同el-upload, 将作为默认配置，可以被组件配置覆盖
 * limitSize[Number]:           允许上传的最大文件尺寸，默认 100 * 1024 * 1024（100M）
 * imgCompress[Boolean]:        开启图片上传前压缩, default: true
 * imgCompressOption[Object]:   图片压缩尺寸配置, default: 
    {
        maxWidth: 1000,            // 最大宽度
        maxHeight: 1000,           // 最大高度
    }
 * imgCrop[Boolean]:            开启图片上传前剪裁, default: false
 * imgCropOption[Object]:       图片剪裁配置, 选项同 [cropperjs](https://github.com/fengyuanchen/cropperjs), default: 
    {
        ratio: 1,               // 剪裁框宽高比
        minWidth: 0,            // 最小输出宽度
        minHeight: 0,           // 最小输出高度
        maxWidth: 1000,         // 最大输出宽度
        maxHeight: 1000,        // 最大输出高度
    }
 * uploadMethod[Function]:      上传处理方法, 接收两个参数（file/blob, fileName），default: 无
 * responseTransfer[Function]:  将上传接口返回数据转成文件数据格式的方法, default: (response) => return response;
 * quickType[Object]:           自定义文件类型, default: 
    {
        "t-image": [".jpg", ".jpeg", ".png", ".gif", ".bmp", ".webp"],
        "t-video": [".mp4", ".rmvb", ".avi", ".mov", ".3gp", ".webm"],
        "t-audio": [".wav", ".mp3", ".ogg", ".acc"],
        "t-word": [".docx", ".doc"],
        "t-excel": [".xlsx", ".xls"],
        "t-ppt": [".ppt", ".pptx"],
        "t-document": [".pdf", "t-word", "t-excel", "t-ppt"],
        "t-zip": [".zip", ".rar"],
    }

 * */
import { Notify } from 'vant';
import { upload as uploadMethod } from "@/main/api/common";

export default {
    uploadMethod,
    beforeUpload(file) {
        // 文件名不得超过500字符
        if (file.name.length > 500) {
            Notify({
                message: `文件名不得超过 500 字符`,
                type: 'warning'
            });
            return false;
        }
    },
    onExceed() {
        Notify({
            message: `超出上传数量限制`,
            type: 'warning'
        });
    },
}
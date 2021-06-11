import {
    instance,
} from '@/api';

// list
export const list = params => {
    return instance.get(`/p51/project/schoolApply/s`, { params })
}

// 创建报名
export const add = params => {
    return instance.post(`/p51/project/schoolApply/noAuth`, params)
}

// 报名处理
export const edit = params => {
    return instance.put(`/p51/project/schoolApply/process`, params)
}

// 报名-直接添加学校参与
export const directAdd = params => {
    return instance.post(`/p51/project/schoolApply/directAdd`, params)
}


// 已参赛学校列表
export const joinedSchools = params => {
    return instance.get(`/p51/project/joinedSchools/noAuth`, { params })
}

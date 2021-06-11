import {
    instance,
} from '@/api';


// list
export const list = params => {
    return instance.get(`/p51/team/s`, { params })
}

export const get = params => {
    return instance.get(`/p51/team/noAuth`, { params })
}

// 
export const add = params => {
    return instance.post(`/p51/team`, params)
}

// 
export const edit = params => {
    return instance.put(`/p51/team`, params)
}


// 我的团队
export const my = params => {
    return instance.get(`/p51/team/my`, { params })
}

// 添加成员
export const addMember = params => {
    return instance.post(`/p51/team/member`, params)
}

// 编辑成员
export const editMember = params => {
    return instance.put(`/p51/team/member`, params)
}

// 指定队长
export const setLeader = params => {
    return instance.put(`/p51/team/leader`, params)
}

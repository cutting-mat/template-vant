import {instance} from '@/api';

// 学
export const addlearn = params => {
  return instance.post(`/p51/process/learn`, params)
}

export const editlearn = params => {
  return instance.put(`/p51/process/learn`, params)
}

export const getlearn = params => {
  return instance.get(`/p51/process/learn/byTeamId`, {params})
}
// 走
export const addwalk = params => {
  return instance.post(`/p51/process/walk`, params)
}

export const editwalk = params => {
  return instance.put(`/p51/process/walk`, params)
}

export const getwalk = params => {
  return instance.get(`/p51/process/walk/byTeamId`, {params})
}
// 访
export const addvisit = params => {
  return instance.post(`/p51/process/visit`, params)
}

export const editvisit = params => {
  return instance.put(`/p51/process/visit`, params)
}

export const getvisit = params => {
  return instance.get(`/p51/process/visit/byTeamId`, {params})
}
// 创
export const addcreate = params => {
  return instance.post(`/p51/process/create`, params)
}

export const editcreate = params => {
  return instance.put(`/p51/process/create`, params)
}

export const getcreate = params => {
  return instance.get(`/p51/process/create/byTeamId`, {params})
}
// 干
export const addactive = params => {
  return instance.post(`/p51/process/active`, params)
}

export const editactive = params => {
  return instance.put(`/p51/process/active`, params)
}

export const getactive = params => {
  return instance.get(`/p51/process/active/byTeamId`, {params})
}

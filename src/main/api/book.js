import { instance } from '@/api';

// list
export const list = params => {
  return instance.get(`/p51/book/s`, { params })
}

// get
export const get = params => {
  return instance.get(`/p51/book`, { params })
}
// post
export const add = params => {
  return instance.post(`/p51/book`, params)
}
// put
export const edit = params => {
  return instance.put(`/p51/book`, params)
}
// delete
export const remove = params => {
  return instance.delete(`/p51/book`, { params })
}

import {instance} from '@/api';

//
export const list = params => {
  return instance.get(`/p51/book/s`, {params})
}


//
export const add = params => {
  return instance.post(`/p51/book`, params)
}

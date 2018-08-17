import instance from './index';

//获取banner列表
const requestBanner = params => {
  return instance.get(`/index.php/api/adver/index`, {params})
}

export {
  requestBanner
}

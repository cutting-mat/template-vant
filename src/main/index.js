import index from './views/index'

export default [{
    path: '/',
    name: '首页',
    component: index,
},
{
    path: '/login',
    name: '登录',
    component: (resolve) => require(['./views/login.vue'], resolve)
}, {
    path: '/404',
    name: '找不到页面',
    component: (resolve) => require(['./views/404.vue'], resolve)
}
]

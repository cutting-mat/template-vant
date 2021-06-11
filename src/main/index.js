import index from './views/index'

import team from '../team'
import work from '../work'

export default [{
    path: '/',
    name: '首页',
    component: index,
},
...team,
...work,
{
    path: '/login',
    name: '登录',
    component: (resolve) => require(['./views/login.vue'], resolve)
}, {
    path: '/register',
    name: '注册',
    component: (resolve) => require(['./views/register.vue'], resolve)
}, {
    path: '/applyType',
    name: '立即报名',
    component: (resolve) => require(['./views/applyType.vue'], resolve)
}, {
    path: '/apply',
    name: '提交报名',
    component: (resolve) => require(['./views/apply.vue'], resolve)
}, {
    path: '/401',
    name: '无权访问',
    component: (resolve) => require(['./views/401.vue'], resolve)
}, {
    path: '/404',
    name: '找不到页面',
    component: (resolve) => require(['./views/404.vue'], resolve)
}
]

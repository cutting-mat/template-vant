export default [{
    path: '/work',
    name: '工作',
    component: (resolve) => require(['./views/index.vue'], resolve),
    children: [{
        path: 'work1',
        name: '五个一-学',
        component: (resolve) => require(['./views/work1.vue'], resolve)
    },{
        path: 'work2',
        name: '五个一-走',
        component: (resolve) => require(['./views/work2.vue'], resolve)
    },{
        path: 'work3',
        name: '五个一-访',
        component: (resolve) => require(['./views/work3.vue'], resolve)
    },{
        path: 'work4',
        name: '五个一-创',
        component: (resolve) => require(['./views/work4.vue'], resolve)
    },{
        path: 'work5',
        name: '五个一-干',
        component: (resolve) => require(['./views/work5.vue'], resolve)
    }]
}]
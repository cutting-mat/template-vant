export default [{
    path: '/team',
    name: '团队',
    component: (resolve) => require(['./views/index.vue'], resolve),
    children: [{
        path: 'detail',
        name: '团队详情',
        component: (resolve) => require(['./views/detail.vue'], resolve)
    }, {
        path: 'edit',
        name: '团队信息',
        component: (resolve) => require(['./views/edit.vue'], resolve)
    }, {
        path: 'createTeam',
        name: '创建团队',
        component: (resolve) => require(['./views/createTeam.vue'], resolve)
    }, {
        path: 'invite',
        name: '团队邀请',
        component: (resolve) => require(['./views/invite.vue'], resolve)
    }, {
        path: 'myTeamList',
        name: '我的团队',
        component: (resolve) => require(['./views/myTeamList.vue'], resolve)
    }, {
        path: 'teamMember',
        name: '团队成员',
        component: (resolve) => require(['./views/teamMember.vue'], resolve)
    }, {
        path: 'progressRank',
        name: '进度排名',
        component: (resolve) => require(['./views/progressRank.vue'], resolve)
    }]
}]
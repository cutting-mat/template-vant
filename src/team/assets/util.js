export const projectStateList = [
    '阶段一：组建团队，开展一学',
    '阶段二：开展走、访、创、干',
    '阶段三：投票和专家评审',
    '阶段四：获奖结果公示'
]

export const workStateList = [
    '学：研读一篇经典文献',
    '走：参观考察一个红色景点',
    '访：采访一位优秀党员',
    '创：创作一部原创红色文化作品',
    '干：干一件有益于学校、社区、家乡或某有特定困难群体的实事'
]

export const isCaptain = (user, teamInfo) => {
    // 当前用户是否为队长
    let id = user.memberId || user.id;
    return id && (id === teamInfo.leaderId)
}

export const hasCaptainPermission = (user, teamInfo) => {
    // 当前用户是否为队长或老师
    let isTeacher = false;
    if(Array.isArray(teamInfo.teachers) && teamInfo.teachers.length){
        isTeacher = teamInfo.teachers.findIndex(t => {
            return t.memberId === user.id
        })!==-1
    }
    return isTeacher || isCaptain(user, teamInfo)
}

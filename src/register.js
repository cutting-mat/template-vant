// 全局组件

const globalComponents = {
    InviteDialog: () => import(/* webpackChunkName: "global-components" */ "@/main/components/InviteDialog.vue"),

}


// 全局过滤器
import {formatDate} from '@/main/assets/util'

const globalFilters = {
    date: formatDate
}

export default {
    install: function(Vue) {
        // 注册过滤器
        Object.keys(globalFilters).forEach(key => {
            Vue.filter(key, globalFilters[key])
        })

        // 注册组件
        Object.keys(globalComponents).forEach(key => {
            Vue.component(key, globalComponents[key])
        })

    }
}
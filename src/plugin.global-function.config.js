/**
 * 全局组件
 * */
import Header from '@/main/components/Header.vue'

export const components = {
    Header,
    Breadcrumb: () => import("@/main/components/Breadcrumb.vue"),
    SubNav: () => import("@/main/components/SubNav.vue"),
    Pagination: () => import("@/main/components/Pagination.vue"),
    ToolBar: () => import("@/main/components/ToolBar.vue"),
}

/**
 * 全局过滤器
 * */
 export const filters = {
    "test"() {
        return "test filters"
    }
}

/**
 * 全局指令
 * */
 export const directives = {
    'test': {
        inserted(el) {
            setTimeout(() => {
                el.innerText += ' test directive inject!'
            }, 0)
        }
    }
}

/**
 * 实例方法
 * */
 export const $methods = {
    $test() {
        // 用于测试可删除
        return ('test instance method output!')
    }
}

/**
 * 全局方法
 * */
 export const methods = {
    Test() {
        return ('test globalMethod output!')
    }
}

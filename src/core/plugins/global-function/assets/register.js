
export default {
    install: function (app, resources) {
        // 注册过滤器
        app.config.globalProperties.$filter = resources.filters

        // 注册组件
        Object.keys(resources.components).forEach(key => {
            app.component(key, resources.components[key])
        })

        // 注册全局方法
        Object.keys(resources.methods).forEach(key => {
            app[key] = resources.methods[key]
        })

        // 注册指令
        Object.keys(resources.directives).forEach(key => {
            app.directive(key, resources.directives[key])
        })

        // 注册实例方法
        Object.keys(resources.$methods).forEach(key => {
            app.config.globalProperties[key] = resources.$methods[key]
        })

    }
}
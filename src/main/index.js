import index from './views/index'

import pkgTemplate from '../__template'

export default [{
    path: '/',
    name: '首页',
    component: index,
    children: [
        ...pkgTemplate
    ]
}]

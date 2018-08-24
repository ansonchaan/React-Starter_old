import Home from '../src/page/home'
import Projects from '../src/page/projects'
import ProjectSingle from '../src/page/single/project'

const routes = [
    {
        path: '/(en|zh)/',
        exact: true,
        component: [Home]
    },
    {
        path: '/(en|zh)/projects/',
        exact: true,
        component: [Projects]
    },
    {
        path: '/(en|zh)/project/(.+)',
        exact: true,
        component: [ProjectSingle]
    }
]

export default routes;
import {defineConfig} from '@umijs/max';

export default defineConfig({
    antd: {
        // configProvider
        configProvider: {},
        // themes
        dark: true,
        compact: true,
        // less or css, default less
        style: 'less',
        // shortcut of `configProvider.theme`
        // use to configure theme token, antd v5 only
        theme: {},
        // antd <App /> valid for version 5.1.0 or higher, default: undefined
        appConfig: {},
        // Transform DayJS to MomentJS
        momentPicker: true,
        // Add StyleProvider for legacy browsers
        styleProvider: {
            hashPriority: 'high',
            legacyTransformer: true,
        },
    },
    access: {},
    model: {},
    initialState: {},
    request: {},
    layout: {
        title: '@umijs/max',
    },
    routes: [
        {
            path: '/',
            redirect: '/home',
        },
        {
            name: '首页',
            path: '/home',
            component: './Home',
        },
        {
            name: '权限演示',
            path: '/access',
            component: './Access',
        },
        {
            name: ' CRUD 示例',
            path: '/table',
            component: './Table',
        },
        {
            name: ' Test 页面',
            path: '/test',
            component: './Test',
        },
    ],
    npmClient: 'pnpm',
});


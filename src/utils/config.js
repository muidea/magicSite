module.exports = {
  name: 'MagicWeb Center',
  prefix: 'antdAdmin',
  footerText: 'MagicWeb Center  © 2017 muidea.com',
  logo: '/logo.png',
  iconFontCSS: '/iconfont.css',
  iconFontJS: '/iconfont.js',
  baseURL: 'http://localhost:8888/api/v1',
  YQL: ['http://www.zuimeitianqi.com'],
  CORS: ['http://localhost:8888/api/v1'],
  openPages: ['/login'],
  apiPrefix: '/api/v1',
  api: {
    userLogin: '/cas/user/',
    userLogout: '/cas/user/',
    userStatus: '/cas/user/',
    userInfo: '/userInfo',
    users: '/account/users/',
    user: '/account/user/:id/',
    groups: '/groups',
    group: '/group/:id',
    articles: '/groups',
    article: '/group/:id',
    catalogs: '/groups',
    catalog: '/group/:id',
    links: '/groups',
    link: '/group/:id',
    medias: '/groups',
    media: '/group/:id',
    dashboard: '/dashboard',
  },
}

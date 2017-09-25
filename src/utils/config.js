const APIV1 = '/api/v1'
const APIV2 = '/api/v2'

module.exports = {
  name: 'MagicCenter',
  prefix: 'magicAdmin',
  footerText: 'MagicCenter © 2017 muidea.com',
  logo: '/logo.png',
  iconFontCSS: '/iconfont.css',
  iconFontJS: '/iconfont.js',
  CORS: [],
  openPages: ['/login'],
  apiPrefix: '/api/v1',
  APIV1,
  APIV2,
  api: {
    userLogin: `${APIV1}/cas/user`,
    userLogout: `${APIV1}/cas/user`,
    userInfo: `${APIV1}/cas/user`,
    users: `${APIV1}/users`,
    user: `${APIV1}/user/:id`,
    groups: `${APIV1}/groups`,
    group: `${APIV1}/group/:id`,
    articles: `${APIV1}/articles`,
    article: `${APIV1}/article/:id`,
    posts: `${APIV1}/posts`,
    dashboard: `${APIV1}/dashboard`,
    menus: `${APIV1}/menus`,
    weather: `${APIV1}/weather`,
    v1test: `${APIV1}/test`,
    v2test: `${APIV2}/test`,
  }, 
}

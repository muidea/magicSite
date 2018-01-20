const APIV1 = '/api/v1'
const APIV2 = '/api/v2'
const ContentApiV1 = '/api/v1/content'
const AccountApiV1 = '/api/v1/account'
const AuthorityApiV1 = '/api/v1/authority'

module.exports = {
  name: 'MagicCenter',
  prefix: 'magicCenter',
  footerText: 'MagicCenter © 2017 muidea.com',
  logo: '/logo.png',
  iconFontCSS: '/iconfont.css',
  iconFontJS: '/iconfont.js',
  openPages: ['/login'],
  apiPrefix: '/api/v1',
  APIV1,
  APIV2,
  api: {
    userLogin: `${APIV1}/cas/user`,
    userLogout: `${APIV1}/cas/user`,
    userInfo: `${APIV1}/cas/user`,
    articles: `${ContentApiV1}/articles`,
    article: `${ContentApiV1}/article/:id`,
    catalogs: `${ContentApiV1}/catalogs`,
    catalog: `${ContentApiV1}/catalog/:id`,
    links: `${ContentApiV1}/links`,
    link: `${ContentApiV1}/link/:id`,
    medias: `${ContentApiV1}/medias`,
    media: `${ContentApiV1}/media/:id`,
    users: `${AccountApiV1}/users`,
    user: `${AccountApiV1}/user/:id`,
    groups: `${AccountApiV1}/groups`,
    group: `${AccountApiV1}/group/:id`,
    acls: `${AuthorityApiV1}/acls`,
    acl: `${AuthorityApiV1}/acl/:id`,
    modules: `${AuthorityApiV1}/modules`,
    module: `${AuthorityApiV1}/module/:id`,
    systemInfo: `${APIV1}/system/config/`,
    posts: `${APIV1}/posts`,
    dashboard: `${APIV1}/dashboard`,
    menus: `${APIV1}/menus`,
    weather: `${APIV1}/weather`,
    v1test: `${APIV1}/test`,
    v2test: `${APIV2}/test`,
  },
}

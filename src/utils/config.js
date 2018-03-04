const APIV1 = '/api/v1'
const APIV2 = '/api/v2'
const CasApi = '/api/v2/cas'
const ContentApi = '/api/v2/content'
const AccountApi = '/api/v2/account'
const AuthorityApi = '/api/v2/authority'
const SystemInfoApi = '/api/v2/system'

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
    userLogin: `${CasApi}/user/`,
    userLogout: `${CasApi}/user/`,
    userInfo: `${CasApi}/user/`,
    articles: `${ContentApi}/article/`,
    article: `${ContentApi}/article/:id`,
    catalogs: `${ContentApi}/catalog/`,
    catalog: `${ContentApi}/catalog/:id`,
    links: `${ContentApi}/links/`,
    link: `${ContentApi}/link/:id`,
    medias: `${ContentApi}/media/`,
    media: `${ContentApi}/media/:id`,
    users: `${AccountApi}/user/`,
    user: `${AccountApi}/user/:id`,
    groups: `${AccountApi}/group/`,
    group: `${AccountApi}/group/:id`,
    acls: `${AuthorityApi}/acl/`,
    acl: `${AuthorityApi}/acl/:id`,
    modules: `${AuthorityApi}/module/`,
    module: `${AuthorityApi}/module/:id`,
    authUsers: `${AuthorityApi}/user/`,
    authUser: `${AuthorityApi}/user/:id`,
    systemInfo: `${SystemInfoApi}/config/`,
    posts: `${APIV1}/posts`,
    dashboard: `${APIV1}/dashboard`,
    menus: `${APIV1}/menus`,
    weather: `${APIV1}/weather`,
    v1test: `${APIV1}/test`,
    v2test: `${APIV2}/test`,
  },
}

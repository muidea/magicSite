const APIV1 = '/api/v1'
const APIV2 = '/api/v2'
const CasApi = '/api/v2/cas'
const ContentApi = '/api/v2/content'
const AccountApi = '/api/v2/account'
const AuthorityApi = '/api/v2/authority'
const ModuleApi = '/api/v2/module'
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
    articles: `${ContentApi}/articles/`,
    article: `${ContentApi}/article/:id`,
    catalogs: `${ContentApi}/catalogs/`,
    catalog: `${ContentApi}/catalog/:id`,
    links: `${ContentApi}/links/`,
    link: `${ContentApi}/link/:id`,
    medias: `${ContentApi}/medias/`,
    media: `${ContentApi}/media/:id`,
    users: `${AccountApi}/user/`,
    user: `${AccountApi}/user/:id`,
    groups: `${AccountApi}/group/`,
    group: `${AccountApi}/group/:id`,
    acls: `${AuthorityApi}/acl/`,
    acl: `${AuthorityApi}/acl/:id`,
    authModules: `${AuthorityApi}/module/`,
    authModule: `${AuthorityApi}/module/:id`,
    authUsers: `${AuthorityApi}/user/`,
    authUser: `${AuthorityApi}/user/:id`,
    modules: `${ModuleApi}/`,
    module: `${ModuleApi}/:id`,
    systemInfo: `${SystemInfoApi}/config/`,
    dashboard: `${APIV1}/dashboard`,
    menus: `${APIV1}/menus`,
  },
}

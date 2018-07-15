const CasApi = '/api/v1/cas'
const ContentApi = '/api/v1/content'
const AccountApi = '/api/v1/account'
const AuthorityApi = '/api/v1/authority'
const ModuleApi = '/api/v1/module'
const SystemInfoApi = '/api/v1/system'

module.exports = {
  name: 'MagicCenter',
  prefix: 'magicCenter',
  footerText: 'magicCenter © 2017 muidea.com',
  logo: '/logo.png',
  iconFontCSS: '/iconfont.css',
  iconFontJS: '/iconfont.js',
  openPages: ['/login'],
  apiPrefix: '/api/v1',
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
    summaryDetail: `${ContentApi}/summary/detail/:id`,
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
    authEndpoints: `${AuthorityApi}/endpoint/`,
    authEndpoint: `${AuthorityApi}/endpoint/:id`,
    modules: `${ModuleApi}/`,
    module: `${ModuleApi}/:id`,
    systemInfo: `${SystemInfoApi}/config/`,
    systemMenus: `${SystemInfoApi}/menu/`,
    dashboard: `${SystemInfoApi}/dashboard/`,
  },
}

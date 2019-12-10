const CasApi = '/api/v1/'
const ContentApi = '/api/v1/content'
const AccountApi = '/api/v1/account'
const AuthorityApi = '/api/v1/authority'
const EndpointApi = '/api/v1/endpoint'
const ModuleApi = '/api/v1/module'
const FileRegistryApi = '/api/v1/fileregistry'
const SystemInfoApi = '/api/v1/system'
const APIV1 = '/api/v1'

module.exports = {
  name: 'MagicCenter',
  prefix: 'magicCenter',
  footerText: 'magicCenter © 2017 muidea.com',
  logo: '/logo.png',
  iconFontCSS: '/iconfont.css',
  iconFontJS: '/iconfont.js',
  openPages: ['/login'],
  apiPrefix: '/api/v1',
  APIV1: `${APIV1}`,
  api: {
    userLoginUrl: `${CasApi}/user/login/`,
    userLogoutUrl: `${CasApi}/user/logout/`,
    userStatusUrl: `${CasApi}/user/status/`,

    articles: `${ContentApi}/articles/`,
    article: `${ContentApi}/article/:id`,
    catalogs: `${ContentApi}/catalogs/`,
    catalog: `${ContentApi}/catalog/:id`,
    links: `${ContentApi}/links/`,
    link: `${ContentApi}/link/:id`,
    medias: `${ContentApi}/medias/`,
    media: `${ContentApi}/media/:id`,
    batchAddMedias: `${ContentApi}/media/batch/`,
    getSummary: `${ContentApi}/summary/:id`,
    querySummary: `${ContentApi}/summarys/`,
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
    endpointRegistrys: `${EndpointApi}/registry/`,
    endpointRegistry: `${EndpointApi}/registry/:id`,
    modules: `${ModuleApi}/`,
    module: `${ModuleApi}/:id`,
    systemInfo: `${SystemInfoApi}/config/`,
    systemMenus: `${SystemInfoApi}/menu/`,
    fileRegistry: `${FileRegistryApi}/file/`,
    dashboard: `${SystemInfoApi}/dashboard/`,
  },
}

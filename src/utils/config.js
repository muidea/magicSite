
const SystemInfoApi = '/api/v1/system'

const CasInfoApi = '/api/v1/account'
const ContentApi = '/api/v1'
const AccountApi = '/api/v1/account'
const PrivateApi = '/api/v1/private'

const FileRegistryApi = '/api/v1/fileregistry'
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
    systemInfoUrl: `${SystemInfoApi}/info/`,
    systemDashBoardUrl: `${SystemInfoApi}/dashboard/`,

    casLoginUrl: `${CasInfoApi}/login/`,
    casLogoutUrl: `${CasInfoApi}/logout/`,
    casStatusUrl: `${CasInfoApi}/status/`,

    queryAllArticleUrl: `${ContentApi}/article/query/all/`,
    queryArticleUrl: `${ContentApi}/article/query/:id`,
    filterArticleUrl: `${ContentApi}/article/query/`,
    deleteArticleUrl: `${ContentApi}/article/delete/:id`,
    createArticleUrl: `${ContentApi}/article/create/`,
    updateArticleUrl: `${ContentApi}/article/update/:id`,

    queryAllCatalogUrl: `${ContentApi}/catalog/query/all/`,
    queryCatalogUrl: `${ContentApi}/catalog/query/:id`,
    filterCatalogUrl: `${ContentApi}/catalog/query/`,
    deleteCatalogUrl: `${ContentApi}/catalog/delete/:id`,
    createCatalogUrl: `${ContentApi}/catalog/create/`,
    updateCatalogUrl: `${ContentApi}/catalog/update/:id`,

    queryAllLinkUrl: `${ContentApi}/link/query/all/`,
    queryLinkUrl: `${ContentApi}/link/query/:id`,
    filterLinkUrl: `${ContentApi}/link/query/`,
    deleteLinkUrl: `${ContentApi}/link/delete/:id`,
    createLinkUrl: `${ContentApi}/link/create/`,
    updateLinkUrl: `${ContentApi}/link/update/:id`,

    queryAllMediaUrl: `${ContentApi}/media/query/all/`,
    queryMediaUrl: `${ContentApi}/media/query/:id`,
    filterMediaUrl: `${ContentApi}/media/query/`,
    deleteMediaUrl: `${ContentApi}/media/delete/:id`,
    createMediaUrl: `${ContentApi}/media/create/`,
    updateMediaUrl: `${ContentApi}/media/update/:id`,

    queryAllCommentUrl: `${ContentApi}/comment/query/all/`,
    queryCommentUrl: `${ContentApi}/comment/query/:id`,
    filterCommentUrl: `${ContentApi}/comment/query/`,
    deleteCommentUrl: `${ContentApi}/comment/delete/:id`,
    createCommentUrl: `${ContentApi}/comment/create/`,
    updateCommentUrl: `${ContentApi}/comment/update/:id`,

    queryAllAccountUrl: `${AccountApi}/query/all/`,
    queryAccountUrl: `${AccountApi}/query/:id`,
    createAccountUrl: `${AccountApi}/create/`,
    deleteAccountUrl: `${AccountApi}/delete/:id`,
    updateAccountUrl: `${AccountApi}/update/:id`,

    queryAllPrivateUrl: `${PrivateApi}/query/`,
    savePrivateUrl: `${PrivateApi}/save/`,
    destoryPrivateUrl: `${PrivateApi}/destory/`,

    systemInfo: `${SystemInfoApi}/config/`,
    systemMenus: `${SystemInfoApi}/menu/`,
    fileRegistry: `${FileRegistryApi}/file/`,
  },
}

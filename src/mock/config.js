const config = require('../utils/config')

const { apiPrefix } = config

const systemconfig = {
  siteName: 'Magic System',
  siteDomain: 'muidea.com',
  siteDescription: '这是站点描述，放在这里占坑，看看效果怎样',
  emailServer: 'smtp.126.com',
  emailAccount: 'admin@muidea.com',
  emailPassword: '******',
}

module.exports = {
  [`GET ${apiPrefix}/system/config/`] (req, res) {
    res.status(200).json({ systemInfo: systemconfig })
  },

  [`PUT ${apiPrefix}/system/config/`] (req, res) {
    const { siteName, siteDomain, siteDescription, emailServer, emailAccount, emailPassword } = req.body
    if (siteName) {
      systemconfig.siteName = siteName
    }
    if (siteDomain) {
      systemconfig.siteDomain = siteDomain
    }
    if (siteDescription) {
      systemconfig.siteDescription = siteDescription
    }
    if (emailServer) {
      systemconfig.emailServer = emailServer
    }
    if (emailAccount) {
      systemconfig.emailAccount = emailAccount
    }
    if (emailPassword) {
      systemconfig.emailPassword = emailPassword
    }

    res.status(200).json({ systemInfo: systemconfig })
  },


}


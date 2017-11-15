const qs = require('qs')
const Mock = require('mockjs')
const config = require('../utils/config')
const { apiPrefix } = config

const systemconfig = {
    siteName: 'Magic System',
    siteDomain: 'muidea.com',
    siteDescription: '这是站点描述，放在这里占坑，看看效果怎样',
    emailServer: 'smtp.126.com',
    emailAccount: 'rangh@126.com',
    emailPassword: '******',
  }


module.exports = {
  [`GET ${apiPrefix}/system/config/`] (req, res) {
    res.status(200).json({systemInfo: systemconfig})
  },


} 


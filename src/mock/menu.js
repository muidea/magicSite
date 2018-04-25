const { config } = require('./common')

const { apiPrefix } = config
let database = [
  {
    id: '1',
    icon: 'laptop',
    name: '主页',
    module: 'common',
    route: '/dashboard',
  },
  {
    id: '2',
    bpid: '1',
    name: '内容管理',
    icon: 'appstore-o',
    module: 'content',
    route: '/content',
  },
  {
    id: '21',
    bpid: '2',
    mpid: '2',
    name: '文章管理',
    icon: 'file',
    route: '/content/article',
  },
  {
    id: '211',
    mpid: '-1',
    bpid: '21',
    name: '新建文章',
    icon: 'edit',
    route: '/content/article/add',
  },
  {
    id: '212',
    mpid: '-1',
    bpid: '21',
    name: '编辑文章',
    icon: 'edit',
    route: '/content/article/edit/:id',
  },
  {
    id: '213',
    mpid: '-1',
    bpid: '21',
    name: '文章详情',
    icon: 'book',
    route: '/content/article/view/:id',
  },
  {
    id: '22',
    bpid: '2',
    mpid: '2',
    name: '分类管理',
    icon: 'tags-o',
    route: '/content/catalog',
  },
  {
    id: '221',
    mpid: '-1',
    bpid: '22',
    name: '分类详情',
    icon: 'book',
    route: '/content/catalog/view/:id',
  },
  {
    id: '23',
    bpid: '2',
    mpid: '2',
    name: '链接管理',
    icon: 'share-alt',
    route: '/content/link',
  },
  {
    id: '231',
    mpid: '-1',
    bpid: '23',
    name: '链接详情',
    icon: 'book',
    route: '/content/link/view/:id',
  },
  {
    id: '24',
    bpid: '2',
    mpid: '2',
    name: '文件管理',
    icon: 'picture',
    route: '/content/media',
  },
  {
    id: '241',
    mpid: '-1',
    bpid: '24',
    name: '文件详情',
    icon: 'book',
    route: '/content/media/view/:id',
  },
  {
    id: '3',
    bpid: '1',
    name: '账号管理',
    module: 'account',
    icon: 'team',
  },
  {
    id: '31',
    bpid: '3',
    mpid: '3',
    name: '用户信息',
    icon: 'user',
    route: '/account/user',
  },
  {
    id: '311',
    mpid: '-1',
    bpid: '31',
    name: '用户详情',
    icon: 'book',
    route: '/account/user/view/:id',
  },
  {
    id: '32',
    bpid: '3',
    mpid: '3',
    name: '分组信息',
    icon: 'folder',
    route: '/account/group',
  },
  {
    id: '321',
    mpid: '-1',
    bpid: '32',
    name: '分组详情',
    icon: 'book',
    route: '/account/group/view/:id',
  },
  {
    id: '4',
    bpid: '1',
    name: '权限管理',
    module: 'authority',
    icon: 'select',
  },
  {
    id: '41',
    bpid: '4',
    mpid: '4',
    name: 'ACL管理',
    icon: 'usb',
    route: '/authority/acl',
  },
  {
    id: '411',
    mpid: '-1',
    bpid: '41',
    name: 'ACL详情',
    icon: 'book',
    route: '/authority/acl/view/:id',
  },
  {
    id: '42',
    bpid: '4',
    mpid: '4',
    name: '模块管理',
    icon: 'api',
    route: '/authority/module',
  },
  {
    id: '421',
    mpid: '-1',
    bpid: '42',
    name: '模块详情',
    icon: 'book',
    route: '/authority/module/view/:id',
  },
  {
    id: '422',
    mpid: '-1',
    bpid: '42',
    name: '模块编辑',
    icon: 'book',
    route: '/authority/module/edit/:id',
  },
  {
    id: '43',
    bpid: '4',
    mpid: '4',
    name: '用户管理',
    icon: 'user',
    route: '/authority/user',
  },
  {
    id: '431',
    mpid: '-1',
    bpid: '43',
    name: '用户详情',
    icon: 'book',
    route: '/authority/user/view/:id',
  },
  {
    id: '5',
    bpid: '1',
    name: '系统设置',
    module: 'system',
    icon: 'setting',
  },
  {
    id: '51',
    bpid: '5',
    mpid: '5',
    name: '基本信息',
    icon: 'info-circle-o',
    route: '/system/info',
  },
]

module.exports = {

  [`GET ${apiPrefix}/menus`] (req, res) {
    const { query } = req
    const { authToken } = query
    console.log(query)

    if (authToken) {
      res.status(200).json({ list: database, errorCode: 0 })
    } else {
      res.status(200).json({ errorCode: 2 })
    }
  },
}

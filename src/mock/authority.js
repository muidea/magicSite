const Mock = require('mockjs')
const config = require('../utils/config')

const { apiPrefix } = config


const internalModuleList = [
  { id: '1', name: '平台访客组', description: '普通的访问者的描述信息' },
  { id: '2', name: '平台用户组', description: '注册用户的描述信息' },
  { id: '3', name: '平台管理组', description: '管理用户的描述信息' },
]

const internalMethodList = [
  'POST',
  'GET',
  'PUT',
  'DELETE',
]

const internalAuthGroupList = [
  'POST',
  'GET',
  'PUT',
  'DELETE',
]

Mock.Random.extend({
  moduleInfo () {
    return this.pick(internalModuleList)
  },
  methodInfo () {
    return this.pick(internalMethodList)
  },
  authGroupInfo () {
    return this.pick(internalAuthGroupList)
  },
})

let authorityAclsListData = Mock.mock({
  'data|10-30': [
    {
      id: '@id',
      url: '@url',
      method () { return Mock.Random.methodInfo() },
      module () { return Mock.Random.moduleInfo() },
      authgroup () { return Mock.Random.authGroupInfo() },
    },
  ],
})

let authorityModulesListData = Mock.mock({
  'data|10-30': [
    {
      id: '@id',
      name: '@cname',
      description: '@cparagraph',
    },
  ],
})

let authorityUsersListData = Mock.mock({
  'data|10-30': [
    {
      id: '@id',
      account: '@name',
      module () { return Mock.Random.moduleInfo() },
      avatar () { return Mock.Random.image('100x100', Mock.Random.color(), '#757575', 'png', this.account.substr(0, 1)) },
    },
  ],
})

let authorityAclDataBase = authorityAclsListData.data
let authorityModuleDataBase = authorityModulesListData.data
let authorityUserDataBase = authorityUsersListData.data

// 查询指定的对象
const queryArray = (array, key, keyAlias = 'key') => {
  if (!(array instanceof Array)) {
    return null
  }
  let data

  for (let item of array) {
    if (item[keyAlias] === key) {
      data = item
      break
    }
  }

  if (data) {
    return data
  }
  return null
}

const NOTFOUND = {
  message: 'Not Found',
  documentation_url: 'http://localhost:8000/request',
}

module.exports = {
  [`GET ${apiPrefix}/authority/acls`] (req, res) {
    const { query } = req
    let { pageSize, page, ...other } = query
    pageSize = pageSize || 10
    page = page || 1

    let newData = authorityAclDataBase
    for (let key in other) {
      if ({}.hasOwnProperty.call(other, key)) {
        newData = newData.filter((item) => {
          if ({}.hasOwnProperty.call(item, key)) {
            return String(item[key]).trim().indexOf(decodeURI(other[key]).trim()) > -1
          }
          return true
        })
      }
    }

    res.status(200).json({
      data: newData.slice((page - 1) * pageSize, page * pageSize),
      total: newData.length,
    })
  },

  [`POST ${apiPrefix}/authority/acl`] (req, res) {
    const newData = req.body

    const newAcl = { id: Mock.mock('@id'), url: newData.url, method: newData.method, module: newData.module, authgroup: newData.authgroup }

    authorityAclDataBase.unshift(newAcl)

    res.status(200).end()
  },

  [`GET ${apiPrefix}/authority/acl/:id`] (req, res) {
    const { id } = req.params
    const data = queryArray(authorityAclDataBase, id, 'id')
    if (data) {
      const result = { user: data }
      res.status(200).json(result)
    } else {
      res.status(404).json(NOTFOUND)
    }
  },

  [`PUT ${apiPrefix}/authority/acl/:id`] (req, res) {
    const { id } = req.params
    let isExist = false

    const newData = req.body
    const newUser = { id, account: newData.account, password: newData.password, email: newData.email, group: newData.group }
    newUser.avatar = newUser.avatar || Mock.Random.image('100x100', Mock.Random.color(), '#757575', 'png', newUser.account.substr(0, 1))

    authorityAclDataBase = authorityAclDataBase.map((item) => {
      if (item.id === id) {
        isExist = true
        return Object.assign({}, item, newUser)
      }

      return item
    })

    if (isExist) {
      res.status(201).end()
    } else {
      res.status(404).json(NOTFOUND)
    }
  },

  [`GET ${apiPrefix}/authority/modules`] (req, res) {
    const { query } = req
    let { pageSize, page, ...other } = query
    pageSize = pageSize || 10
    page = page || 1

    let newData = authorityModuleDataBase
    for (let key in other) {
      if ({}.hasOwnProperty.call(other, key)) {
        newData = newData.filter((item) => {
          if ({}.hasOwnProperty.call(item, key)) {
            return String(item[key]).trim().indexOf(decodeURI(other[key]).trim()) > -1
          }
          return true
        })
      }
    }

    res.status(200).json({
      data: newData.slice((page - 1) * pageSize, page * pageSize),
      total: newData.length,
    })
  },

  [`GET ${apiPrefix}/authority/users`] (req, res) {
    const { query } = req
    let { pageSize, page, ...other } = query
    pageSize = pageSize || 10
    page = page || 1

    let newData = authorityUserDataBase
    for (let key in other) {
      if ({}.hasOwnProperty.call(other, key)) {
        newData = newData.filter((item) => {
          if ({}.hasOwnProperty.call(item, key)) {
            return String(item[key]).trim().indexOf(decodeURI(other[key]).trim()) > -1
          }
          return true
        })
      }
    }

    res.status(200).json({
      data: newData.slice((page - 1) * pageSize, page * pageSize),
      total: newData.length,
    })
  },
}

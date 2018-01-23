const Mock = require('mockjs')
const config = require('../utils/config')

const { apiPrefix } = config


const internalModuleList = [
  { id: '1', name: 'Magic CAS', description: '普通的访问者的描述信息' },
  { id: '2', name: 'Magic CMS', description: '注册用户的描述信息' },
  { id: '3', name: 'Magic Blog', description: '管理用户的描述信息' },
  { id: '4', name: 'Magic Test', description: '管理用户的描述信息' },
]

const internalMethodList = [
  'POST',
  'GET',
  'PUT',
  'DELETE',
]

const internalAuthGroupList = [
  { id: 0, name: '访客组' },
  { id: 1, name: '用户组' },
  { id: 2, name: '维护组' },
]

const internalUserList = [
  { id: 0, name: 'admin' },
  { id: 1, name: 'ywz' },
  { id: 2, name: 'guest' },
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
  userInfo () {
    return this.shuffle(internalUserList)
  },
  userModuleInfo () {
    return this.shuffle(internalModuleList)
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
      user () { return Mock.Random.userInfo() },
    },
  ],
})

let authorityUsersListData = Mock.mock({
  'data|10-30': [
    {
      id: '@id',
      account: '@name',
      module () { return Mock.Random.userModuleInfo() },
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

    const authgroup = queryArray(internalAuthGroupList, newData.authgroup, 'id')
    const module = queryArray(internalModuleList, newData.module, 'id')
    const newAcl = { id: Mock.mock('@id'), url: newData.url, method: newData.method, module, authgroup, status: newData.status }

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
    const authgroup = queryArray(internalAuthGroupList, newData.authgroup, 'id')
    const module = queryArray(internalModuleList, newData.module, 'id')
    const newAcl = { id, url: newData.url, method: newData.method, module, authgroup, status: newData.status }

    authorityAclDataBase = authorityAclDataBase.map((item) => {
      if (item.id === id) {
        isExist = true
        return Object.assign({}, item, newAcl)
      }

      return item
    })

    if (isExist) {
      res.status(201).end()
    } else {
      res.status(404).json(NOTFOUND)
    }
  },

  [`DELETE ${apiPrefix}/authority/acl/:id`] (req, res) {
    const { id } = req.params
    const data = queryArray(authorityAclDataBase, id, 'id')
    if (data) {
      authorityAclDataBase = authorityAclDataBase.filter(item => item.id !== id)
      res.status(204).end()
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

  [`GET ${apiPrefix}/authority/module/:id`] (req, res) {
    const { id } = req.params
    const data = queryArray(authorityModuleDataBase, id, 'id')
    if (data) {
      const result = { module: data }
      res.status(200).json(result)
    } else {
      res.status(404).json(NOTFOUND)
    }
  },

  [`PUT ${apiPrefix}/authority/module/:id`] (req, res) {
    const { id } = req.params
    let isExist = false

    const newData = req.body
    const newModule = { id, name: newData.name, user: newData.user }

    authorityModuleDataBase = authorityModuleDataBase.map((item) => {
      if (item.id === id) {
        isExist = true
        return Object.assign({}, item, newModule)
      }

      return item
    })

    if (isExist) {
      res.status(201).end()
    } else {
      res.status(404).json(NOTFOUND)
    }
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

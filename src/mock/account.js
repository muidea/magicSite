const Mock = require('mockjs')
const config = require('../utils/config')

const { apiPrefix } = config


const internalGroupList = [
  { id: '1', name: '平台访客组', description: '普通的访问者的描述信息', catalog: 0 },
  { id: '2', name: '平台用户组', description: '注册用户的描述信息', catalog: 1 },
  { id: '3', name: '平台管理组', description: '管理用户的描述信息', catalog: 2 },
]

Mock.Random.extend({
  groupInfo () {
    return this.pick(internalGroupList)
  },
})

let usersListData = Mock.mock({
  'data|10-30': [
    {
      id: '@id',
      account: '@word',
      password: '@word',
      nickName: '@name',
      email: '@email',
      group () { return Mock.Random.groupInfo() },
      avatar () { return Mock.Random.image('100x100', Mock.Random.color(), '#757575', 'png', this.account.substr(0, 1)) },
    },
  ],
})

let groupListData = Mock.mock({
  'data|3-5': [
    {
      id: '@id',
      name: '@name',
      description: '@paragraph',
      catalog: '@integer(0, 2)',
      avatar () { return Mock.Random.image('100x100', Mock.Random.color(), '#757575', 'png', this.name.substr(0, 1)) },
    },
  ],
})

const constructGroupDataBase = (database) => {
  for (let item of internalGroupList) {
    item.avatar = Mock.Random.image('100x100', Mock.Random.color(), '#757575', 'png', item.name.substr(0, 1))

    database.push(item)
  }

  return database
}

let userDataBase = usersListData.data
let groupDataBase = groupListData.data

groupDataBase = constructGroupDataBase(groupDataBase)

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
  [`GET ${apiPrefix}/account/users`] (req, res) {
    const { query } = req
    let { pageSize, page, ...other } = query
    pageSize = pageSize || 10
    page = page || 1

    let newData = userDataBase
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

  [`DELETE ${apiPrefix}/account/users`] (req, res) {
    const { ids } = req.body
    userDataBase = userDataBase.filter(item => !ids.some(_ => _ === item.id))
    res.status(204).end()
  },


  [`POST ${apiPrefix}/account/user`] (req, res) {
    const newData = req.body

    const newUser = { id: Mock.mock('@id'), account: newData.account, password: newData.password, email: newData.email, group: newData.group }
    newUser.avatar = newUser.avatar || Mock.Random.image('100x100', Mock.Random.color(), '#757575', 'png', newUser.account.substr(0, 1))

    userDataBase.unshift(newUser)

    res.status(200).end()
  },

  [`GET ${apiPrefix}/account/user/:id`] (req, res) {
    const { id } = req.params
    const data = queryArray(userDataBase, id, 'id')
    if (data) {
      const result = { user: data }
      res.status(200).json(result)
    } else {
      res.status(404).json(NOTFOUND)
    }
  },

  [`DELETE ${apiPrefix}/account/user/:id`] (req, res) {
    const { id } = req.params
    const data = queryArray(userDataBase, id, 'id')
    if (data) {
      userDataBase = userDataBase.filter(item => item.id !== id)
      res.status(204).end()
    } else {
      res.status(404).json(NOTFOUND)
    }
  },

  [`PUT ${apiPrefix}/account/user/:id`] (req, res) {
    const { id } = req.params
    let isExist = false

    const newData = req.body
    const newUser = { id, account: newData.account, password: newData.password, email: newData.email, group: newData.group }
    newUser.avatar = newUser.avatar || Mock.Random.image('100x100', Mock.Random.color(), '#757575', 'png', newUser.account.substr(0, 1))

    userDataBase = userDataBase.map((item) => {
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

  [`GET ${apiPrefix}/account/groups`] (req, res) {
    const { query } = req
    let { pageSize, page } = query
    pageSize = pageSize || 10
    page = page || 1

    let newData = groupDataBase
    res.status(200).json({
      data: newData.slice((page - 1) * pageSize, page * pageSize),
      total: newData.length,
    })
  },

  [`DELETE ${apiPrefix}/account/groups`] (req, res) {
    const { ids } = req.body
    groupDataBase = groupDataBase.filter(item => !ids.some(_ => _ === item.id))
    res.status(204).end()
  },


  [`POST ${apiPrefix}/account/group`] (req, res) {
    const newData = req.body
    const newCatalog = { id: Mock.mock('@id'), name: newData.name, description: newData.description, catalog: newData.catalog }
    newCatalog.avatar = newCatalog.avatar || Mock.Random.image('100x100', Mock.Random.color(), '#757575', 'png', newCatalog.name.substr(0, 1))

    groupDataBase.unshift(newCatalog)

    res.status(200).end()
  },

  [`GET ${apiPrefix}/account/group/:id`] (req, res) {
    const { id } = req.params
    const data = queryArray(groupDataBase, id, 'id')
    if (data) {
      const result = { group: data }
      res.status(200).json(result)
    } else {
      res.status(404).json(NOTFOUND)
    }
  },

  [`DELETE ${apiPrefix}/account/group/:id`] (req, res) {
    const { id } = req.params
    const data = queryArray(groupDataBase, id, 'id')
    if (data) {
      groupDataBase = groupDataBase.filter(item => item.id !== id)
      res.status(204).end()
    } else {
      res.status(404).json(NOTFOUND)
    }
  },

  [`PUT ${apiPrefix}/account/group/:id`] (req, res) {
    const { id } = req.params
    let isExist = false

    const newData = req.body
    const newCatalog = { id, name: newData.name, description: newData.description, catalog: newData.catalog }
    newCatalog.avatar = newCatalog.avatar || Mock.Random.image('100x100', Mock.Random.color(), '#757575', 'png', newCatalog.name.substr(0, 1))

    groupDataBase = groupDataBase.map((item) => {
      if (item.id === id) {
        isExist = true
        return Object.assign({}, item, newCatalog)
      }

      return item
    })

    if (isExist) {
      res.status(201).end()
    } else {
      res.status(404).json(NOTFOUND)
    }
  },
}

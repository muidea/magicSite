const qs = require('qs')
const Mock = require('mockjs')
const config = require('../utils/config')

const { apiPrefix } = config

let usersListData = Mock.mock({
  'data|80-100': [
    {
      id: '@id',
      account: '@name',
      name: '@name',
      email: '@email',
      createTime: '@datetime',
      avatar () {
        return Mock.Random.image('100x100', Mock.Random.color(), '#757575', 'png', this.account.substr(0, 1))
      },
    },
  ],
})


let database = usersListData.data

const EnumRoleType = {
  ADMIN: 'admin',
  DEFAULT: 'guest',
  DEVELOPER: 'developer',
}

const userPermission = {
  DEFAULT: {
    visit: ['1', '5', '6', '7', '71', '72', '73', '74'],
    role: EnumRoleType.DEFAULT,
  },
  ADMIN: {
    role: EnumRoleType.ADMIN,
  },
  DEVELOPER: {
    role: EnumRoleType.DEVELOPER,
  },
}

const adminUsers = [
  {
    id: 0,
    account: 'admin',
    name: 'admin',
    password: 'admin',
    email: 'admin@test.com',
    permissions: userPermission.ADMIN,
  }, {
    id: 1,
    account: 'guest',
    name: 'guest',
    password: 'guest',
    email: 'guest@test.com',
    permissions: userPermission.DEFAULT,
  }, {
    id: 2,
    account: 'wyz',
    name: '吴彦祖',
    password: '123456',
    email: 'wyz@test.com',
    permissions: userPermission.DEVELOPER,
  },
]

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

const AuthToken = 'rvelzsmvjdiowcp3ucuntzvaoef906zr'

module.exports = {

  [`POST ${apiPrefix}/cas/user`] (req, res) {
    const { user_account, user_password } = req.body
    const user = adminUsers.filter(item => item.account === user_account)

    if (user.length > 0 && user[0].password === user_password) {
      const now = new Date()
      now.setDate(now.getDate() + 1)
      res.cookie('token', JSON.stringify({ id: user[0].id, deadline: now.getTime() }), {
        maxAge: 900000,
        httpOnly: true,
      })
      res.json({ ErrCode: 0, Reason: '', SessionID:'', AuthToken: AuthToken, User:{ID: user[0].id, Name: user[0].name, Account: user[0].account, Email: user[0].email} })
    } else {
      res.status(400).end()
    }
  },

  [`DELETE ${apiPrefix}/cas/user`] (req, res) {
    res.clearCookie('token')
    res.json({ ErrCode: 0, Reason: '' })
  },

  [`GET ${apiPrefix}/cas/user`] (req, res) {
    const { query } = req
    const { sessionID, authToken } = query
    const cookie = req.headers.cookie || ''
    const cookies = qs.parse(cookie.replace(/\s/g, ''), { delimiter: ';' })
    const response = {}
    const accountInfo = {}
    if (!cookies.token) {
      res.json({ ErrCode: -1, Reason: 'Not Login' })
      return
    }

    if (authToken != AuthToken) {
      res.json({ ErrCode: -1, Reason: 'Illegal AuthToken' })
      return      
    }
    const token = JSON.parse(cookies.token)
    if (token) {
      response.ErrCode = token.deadline > new Date().getTime() ? 0 : -1
    }
    if (response.ErrCode == 0) {
      const userItem = adminUsers.filter(_ => _.id === token.id)
      if (userItem.length > 0) {
        accountInfo.Permissions = userItem[0].permissions
        accountInfo.LoginTime = '1505907360'
        accountInfo.UpdateTime = '1505907360'
        accountInfo.Address = '127.0.0.1'
        accountInfo.Name = userItem[0].name
        accountInfo.ID = userItem[0].id
      }
    }
    response.AccountInfo = accountInfo
    res.json(response)
  },

  [`GET ${apiPrefix}/users`] (req, res) {
    const { query } = req
    let { pageSize, page, ...other } = query
    pageSize = pageSize || 10
    page = page || 1

    let newData = database
    for (let key in other) {
      if ({}.hasOwnProperty.call(other, key)) {
        newData = newData.filter((item) => {
          if ({}.hasOwnProperty.call(item, key)) {
            if (key === 'createTime') {
              const start = new Date(other[key][0]).getTime()
              const end = new Date(other[key][1]).getTime()
              const now = new Date(item[key]).getTime()

              if (start && end) {
                return now >= start && now <= end
              }
              return true
            }
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

  [`DELETE ${apiPrefix}/users`] (req, res) {
    const { ids } = req.body
    database = database.filter(item => !ids.some(_ => _ === item.id))
    res.status(204).end()
  },


  [`POST ${apiPrefix}/user`] (req, res) {
    const newData = req.body

    const newUser = {id: Mock.mock('@id'), account: newData.user_account, name: newData.user_name, email: newData.user_email, createTime: Mock.mock('@now')}
    newUser.avatar = newUser.avatar || Mock.Random.image('100x100', Mock.Random.color(), '#757575', 'png', newUser.account.substr(0, 1))
    
    database.unshift(newUser)

    res.status(200).end()
  },

  [`GET ${apiPrefix}/user/:id`] (req, res) {
    const { id } = req.params
    const data = queryArray(database, id, 'id')
    if (data) {
      res.status(200).json(data)
    } else {
      res.status(404).json(NOTFOUND)
    }
  },

  [`DELETE ${apiPrefix}/user/:id`] (req, res) {
    const { id } = req.params
    const data = queryArray(database, id, 'id')
    if (data) {
      database = database.filter(item => item.id !== id)
      res.status(204).end()
    } else {
      res.status(404).json(NOTFOUND)
    }
  },

  [`PATCH ${apiPrefix}/user/:id`] (req, res) {
    const { id } = req.params
    const editItem = req.body
    let isExist = false

    database = database.map((item) => {
      if (item.id === id) {
        isExist = true
        return Object.assign({}, item, editItem)
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

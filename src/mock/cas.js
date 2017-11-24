const qs = require('qs')
const Mock = require('mockjs')
const config = require('../utils/config')

const { apiPrefix } = config

const EnumRoleType = {
  ADMIN: 'admin',
  DEFAULT: 'guest',
  DEVELOPER: 'developer',
}

const userPermission = {
  DEFAULT: {
    visit: ['1', '5', '6','61', '7', '8', '9', '91', '92','93','94','95','96', '10', '101', '11' ],
    module:['common','content'],
    role: EnumRoleType.DEFAULT,
  },
  ADMIN: {
    module:['common','system','content','account','authority'],
    role: EnumRoleType.ADMIN,
  },
  DEVELOPER: {
    module:['common','system','content','account'],
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
    password: 'wyz',
    email: 'wyz@test.com',
    permissions: userPermission.DEVELOPER,
  },
]

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

}

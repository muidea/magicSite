const qs = require('qs')
const config = require('../utils/config')

const { apiPrefix } = config

const EnumRoleType = {
  ADMIN: 'admin',
  DEFAULT: 'guest',
  DEVELOPER: 'developer',
}

const userPermission = {
  DEFAULT: {
    visit: ['1', '5', '6', '61', '7', '8', '9', '91', '92', '93', '94', '95', '96', '10', '101', '11'],
    module: ['common', 'content'],
    role: EnumRoleType.DEFAULT,
  },
  ADMIN: {
    module: ['common', 'system', 'content', 'account', 'authority'],
    role: EnumRoleType.ADMIN,
  },
  DEVELOPER: {
    module: ['common', 'system', 'content', 'account'],
    role: EnumRoleType.DEVELOPER,
  },
}

const adminUsers = [
  {
    id: 0,
    account: 'admin',
    name: '管理员',
    password: 'admin',
    email: 'admin@test.com',
    permissions: userPermission.ADMIN,
  }, {
    id: 1,
    account: 'guest',
    name: '访客',
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
const SessionID = 'aeelzsjdaaafdcp3ucuntzvaoef906zr'

module.exports = {

  [`POST ${apiPrefix}/cas/user`] (req, res) {
    const { account, password } = req.body
    const user = adminUsers.filter(item => item.account === account)

    if (user.length > 0 && user[0].password === password) {
      const now = new Date()
      now.setDate(now.getDate() + 1)
      res.cookie('token', JSON.stringify({ id: user[0].id, deadline: now.getTime() }), {
        maxAge: 900000,
        httpOnly: true,
      })
      res.json({ errorCode: 0, reason: '', sessionID: SessionID, authToken: AuthToken, user: { id: user[0].id, name: user[0].name, account: user[0].account, email: user[0].email } })
    } else {
      res.status(400).end()
    }
  },

  [`DELETE ${apiPrefix}/cas/user`] (req, res) {
    const { sessionID, authToken } = req.body
    if (sessionID === SessionID && authToken === AuthToken) {
      res.clearCookie('token')
      res.json({ errorCode: 0, reason: '' })
    } else {
      res.status(400).end()
    }
  },

  [`GET ${apiPrefix}/cas/user`] (req, res) {
    const { query } = req
    const { sessionID, authToken } = query
    const cookie = req.headers.cookie || ''
    const cookies = qs.parse(cookie.replace(/\s/g, ''), { delimiter: ';' })
    const response = {}
    const accountInfo = {}
    if (!cookies.token) {
      res.json({ errorCode: -1, reason: 'Not Login' })
      return
    }

    if (authToken !== AuthToken || (sessionID !== SessionID)) {
      res.json({ errorCode: -1, reason: 'Illegal authToken' })
      return
    }
    const token = JSON.parse(cookies.token)
    if (token) {
      response.errorCode = token.deadline > new Date().getTime() ? 0 : -1
    }
    if (response.errorCode === 0) {
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
    response.accountInfo = accountInfo
    res.json(response)
  },

}

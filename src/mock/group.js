const qs = require('qs')
const Mock = require('mockjs')
const config = require('../utils/config')

const { apiPrefix } = config

const catalogList = [{id:1, name:'注册用户'}, {id:2, name:'特权用户'}, {id:3, name:'系统管理员'}]

Mock.Random.extend({
  catalogInfo: function(date) {
      return this.pick(catalogList)
  }
})

let groupsListData = Mock.mock({
  'data|80-100': [
    {
      id: '@id',
      name: '@ctitle(5,10)',
      description:'@ctitle(10,20)',
      catalog() {return Mock.Random.catalogInfo()},
      avatar () {
        return Mock.Random.image('100x100', Mock.Random.color(), '#757575', 'png', this.name.substr(0, 1))
      },
    },
  ],
})


let database = groupsListData.data

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

module.exports = {


  [`GET ${apiPrefix}/groups`] (req, res) {
    const { query } = req
    let { pageSize, page, ...other } = query
    pageSize = pageSize || 10
    page = page || 1

    let newData = database
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

  [`DELETE ${apiPrefix}/groups`] (req, res) {
    const { ids } = req.body
    database = database.filter(item => !ids.some(_ => _ === item.id))
    res.status(204).end()
  },


  [`POST ${apiPrefix}/group`] (req, res) {
    const newData = req.body

    const cur = queryArray(catalogList, newData.group_catalog, 'id')
    const newGroup = {id: Mock.mock('@id'), name: newData.group_name, description: newData.group_description, catalog: cur, }
    newGroup.avatar = newGroup.avatar || Mock.Random.image('100x100', Mock.Random.color(), '#757575', 'png', newGroup.name.substr(0, 1))
    
    database.unshift(newGroup)

    res.status(200).end()
  },

  [`GET ${apiPrefix}/group/:id`] (req, res) {
    const { id } = req.params
    const data = queryArray(database, id, 'id')
    if (data) {
      res.status(200).json(data)
    } else {
      res.status(404).json(NOTFOUND)
    }
  },

  [`DELETE ${apiPrefix}/group/:id`] (req, res) {
    const { id } = req.params
    const data = queryArray(database, id, 'id')
    if (data) {
      database = database.filter(item => item.id !== id)
      res.status(204).end()
    } else {
      res.status(404).json(NOTFOUND)
    }
  },

  [`PATCH ${apiPrefix}/group/:id`] (req, res) {
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

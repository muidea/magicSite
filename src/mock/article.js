const qs = require('qs')
const Mock = require('mockjs')
const config = require('../utils/config')

const { apiPrefix } = config

const catalogList = [{ id: 1, name: 'Linux' }, { id: 2, name: 'Go' }, { id: 3, name: 'Cloud' }, { id: 4, name: 'Devlop' }, { id: 5, name: 'Test' }]
const authorList = [{ id: 0, name: 'admin' }, { id: 1, name: 'guest' }, { id: 2, name: 'wyz' }]

Mock.Random.extend({
  catalogInfo () {
    return this.pick(catalogList)
  },

  catalogArray () {
    let first = this.pick(catalogList)
    let second = this.pick(catalogList)
    while (first.id === second.id) {
      second = this.pick(catalogList)
    }

    return [first, second]
  },

  authorInfo () {
    return this.pick(authorList)
  },
})

let articlesListData = Mock.mock({
  'data|50-80': [
    {
      id: '@id',
      title: '@ctitle(5,10)',
      content: '@ctitle(50,200)',
      createdate: '@datetime',
      catalog () { return Mock.Random.catalogArray() },
      author () { return Mock.Random.authorInfo() },
      avatar () {
        return Mock.Random.image('100x100', Mock.Random.color(), '#757575', 'png', this.title.substr(0, 1))
      },
    },
  ],
})

let database = articlesListData.data

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

const selectArray = (array, key, keyAlias = 'key') => {
  if (!(array instanceof Array)) {
    return null
  }
  let data = []

  for (let item of array) {
    for (let idx of key) {
      if (item[keyAlias] === parseInt(idx, 10)) {
        data.unshift(item)
      }
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
  [`GET ${apiPrefix}/articles`] (req, res) {
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

  [`DELETE ${apiPrefix}/articles`] (req, res) {
    const { ids } = req.body
    database = database.filter(item => !ids.some(_ => _ === item.id))
    res.status(204).end()
  },


  [`POST ${apiPrefix}/article`] (req, res) {
    console.log('add article')
    const newData = req.body
    const cookie = req.headers.cookie || ''
    const cookies = qs.parse(cookie.replace(/\s/g, ''), { delimiter: ';' })
    const token = JSON.parse(cookies.token)

    const curAuthor = queryArray(authorList, token.id, 'id')
    const curCatalog = selectArray(catalogList, newData.article_catalog, 'id')
    const newArticle = { id: Mock.mock('@id'), title: newData.article_title, content: newData.article_content, catalog: curCatalog, author: curAuthor, createdate: Mock.mock('@now') }
    newArticle.avatar = newArticle.avatar || Mock.Random.image('100x100', Mock.Random.color(), '#757575', 'png', newArticle.title.substr(0, 1))

    database.unshift(newArticle)

    res.status(200).end()
  },

  [`GET ${apiPrefix}/article/:id`] (req, res) {
    const { id } = req.params
    const data = queryArray(database, id, 'id')
    if (data) {
      const result = { article: data, catalogList }
      res.status(200).json(result)
    } else {
      res.status(404).json(NOTFOUND)
    }
  },

  [`DELETE ${apiPrefix}/article/:id`] (req, res) {
    const { id } = req.params
    const data = queryArray(database, id, 'id')
    if (data) {
      database = database.filter(item => item.id !== id)
      res.status(204).end()
    } else {
      res.status(404).json(NOTFOUND)
    }
  },

  [`PUT ${apiPrefix}/article/:id`] (req, res) {
    const { id } = req.params
    let isExist = false

    const newData = req.body
    const cookie = req.headers.cookie || ''
    const cookies = qs.parse(cookie.replace(/\s/g, ''), { delimiter: ';' })
    const token = JSON.parse(cookies.token)

    const curAuthor = queryArray(authorList, token.id, 'id')
    const curCatalog = selectArray(catalogList, newData.article_catalog, 'id')
    const newArticle = { id, title: newData.article_title, content: newData.article_content, catalog: curCatalog, author: curAuthor }
    newArticle.avatar = newArticle.avatar || Mock.Random.image('100x100', Mock.Random.color(), '#757575', 'png', newArticle.title.substr(0, 1))

    database = database.map((item) => {
      if (item.id === id) {
        isExist = true
        newArticle.createdate = item.createdate
        return Object.assign({}, item, newArticle)
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

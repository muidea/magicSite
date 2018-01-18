const qs = require('qs')
const Mock = require('mockjs')
const config = require('../utils/config')

const { apiPrefix } = config

const catalogList = [
  { id: '1', name: 'Linux', description: 'This is Linux Catalog', parent: [{ id: '0', name: 'Top' }], createdate: '2017-12-30 10:00:00', author: { id: 0, name: 'admin' } },
  { id: '2', name: 'Go', description: 'This is Golang Catalog', parent: [{ id: '0', name: 'Top' }], createdate: '2017-12-30 10:00:00', author: { id: 0, name: 'admin' } },
  { id: '3', name: 'Cloud', description: 'This is Cloud Catalog', parent: [{ id: '0', name: 'Top' }], createdate: '2017-12-30 10:00:00', author: { id: 0, name: 'admin' } },
  { id: '4', name: 'Devlop', description: 'This is Develop Catalog', parent: [{ id: '0', name: 'Top' }], createdate: '2017-12-30 10:00:00', author: { id: 0, name: 'admin' } },
]

const authorList = [
  { id: 0, name: 'admin' },
  { id: 1, name: 'guest' },
  { id: 2, name: 'wyz' },
]

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
      content: '@cparagraph',
      createdate: '@datetime',
      catalog () { return Mock.Random.catalogArray() },
      author () { return Mock.Random.authorInfo() },
      avatar () {
        return Mock.Random.image('100x100', Mock.Random.color(), '#757575', 'png', this.title.substr(0, 1))
      },
    },
  ],
})

let catalogsListData = Mock.mock({
  'data|3-5': [
    {
      id: '@id',
      name: '@ctitle',
      description: '@cparagraph',
      parent: [],
      createdate: '@datetime',
      author () { return Mock.Random.authorInfo() },
      avatar () {
        return Mock.Random.image('100x100', Mock.Random.color(), '#757575', 'png', this.name.substr(0, 1))
      },
    },
  ],
})

let linksListData = Mock.mock({
  'data|3-5': [
    {
      id: '@id',
      name: '@ctitle',
      url: '@url',
      logo: '@url',
      createdate: '@datetime',
      catalog () { return Mock.Random.catalogArray() },
      creater () { return Mock.Random.authorInfo() },
      avatar () {
        return Mock.Random.image('100x100', Mock.Random.color(), '#757575', 'png', this.name.substr(0, 1))
      },
    },
  ],
})

let mediasListData = Mock.mock({
  'data|3-5': [
    {
      id: '@id',
      name: '@ctitle',
      url: '@url',
      description: '@cparagraph',
      createdate: '@datetime',
      catalog () { return Mock.Random.catalogArray() },
      creater () { return Mock.Random.authorInfo() },
      avatar () {
        return Mock.Random.image('100x100', Mock.Random.color(), '#757575', 'png', this.name.substr(0, 1))
      },
    },
  ],
})

const constructCatalogDataBase = (database) => {
  for (let item of catalogList) {
    item.avatar = Mock.Random.image('100x100', Mock.Random.color(), '#757575', 'png', item.name.substr(0, 1))

    database.push(item)
  }

  return database
}

let articleDataBase = articlesListData.data
let catalogDataBase = catalogsListData.data
let linkDataBase = linksListData.data
let mediaDataBase = mediasListData.data

catalogDataBase = constructCatalogDataBase(catalogDataBase)

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

// 选择指定的对象，允许选择多个
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
  [`GET ${apiPrefix}/content/articles`] (req, res) {
    const { query } = req
    let { pageSize, page, ...other } = query
    pageSize = pageSize || 10
    page = page || 1

    let newData = articleDataBase
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

  [`DELETE ${apiPrefix}/content/articles`] (req, res) {
    const { ids } = req.body
    articleDataBase = articleDataBase.filter(item => !ids.some(_ => _ === item.id))
    res.status(204).end()
  },


  [`POST ${apiPrefix}/content/article`] (req, res) {
    const newData = req.body
    const cookie = req.headers.cookie || ''
    const cookies = qs.parse(cookie.replace(/\s/g, ''), { delimiter: ';' })
    const token = JSON.parse(cookies.token)

    const curAuthor = queryArray(authorList, token.id, 'id')
    const curCatalog = selectArray(catalogList, newData.article_catalog, 'id')
    const newArticle = { id: Mock.mock('@id'), title: newData.article_title, content: newData.article_content, catalog: curCatalog, author: curAuthor, createdate: Mock.mock('@now') }
    newArticle.avatar = newArticle.avatar || Mock.Random.image('100x100', Mock.Random.color(), '#757575', 'png', newArticle.title.substr(0, 1))

    articleDataBase.unshift(newArticle)

    res.status(200).end()
  },

  [`GET ${apiPrefix}/content/article/:id`] (req, res) {
    const { id } = req.params
    const data = queryArray(articleDataBase, id, 'id')
    if (data) {
      const result = { article: data }
      res.status(200).json(result)
    } else {
      res.status(404).json(NOTFOUND)
    }
  },

  [`DELETE ${apiPrefix}/content/article/:id`] (req, res) {
    const { id } = req.params
    const data = queryArray(articleDataBase, id, 'id')
    if (data) {
      articleDataBase = articleDataBase.filter(item => item.id !== id)
      res.status(204).end()
    } else {
      res.status(404).json(NOTFOUND)
    }
  },

  [`PUT ${apiPrefix}/content/article/:id`] (req, res) {
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

    articleDataBase = articleDataBase.map((item) => {
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

  [`GET ${apiPrefix}/content/catalogs`] (req, res) {
    const { query } = req
    let { pageSize, page } = query
    pageSize = pageSize || 10
    page = page || 1

    let newData = catalogDataBase
    res.status(200).json({
      data: newData.slice((page - 1) * pageSize, page * pageSize),
      total: newData.length,
    })
  },

  [`DELETE ${apiPrefix}/content/catalogs`] (req, res) {
    const { ids } = req.body
    catalogDataBase = catalogDataBase.filter(item => !ids.some(_ => _ === item.id))
    res.status(204).end()
  },


  [`POST ${apiPrefix}/content/catalog`] (req, res) {
    const newData = req.body
    const cookie = req.headers.cookie || ''
    const cookies = qs.parse(cookie.replace(/\s/g, ''), { delimiter: ';' })
    const token = JSON.parse(cookies.token)
    const curAuthor = queryArray(authorList, token.id, 'id')
    const newCatalog = { id: Mock.mock('@id'), name: newData.name, description: newData.description, parent: newData.parent, author: curAuthor, createdate: Mock.mock('@now') }
    newCatalog.avatar = newCatalog.avatar || Mock.Random.image('100x100', Mock.Random.color(), '#757575', 'png', newCatalog.name.substr(0, 1))

    catalogDataBase.unshift(newCatalog)

    res.status(200).end()
  },

  [`GET ${apiPrefix}/content/catalog/:id`] (req, res) {
    const { id } = req.params
    const data = queryArray(catalogDataBase, id, 'id')
    if (data) {
      const result = { catalog: data }
      res.status(200).json(result)
    } else {
      res.status(404).json(NOTFOUND)
    }
  },

  [`DELETE ${apiPrefix}/content/catalog/:id`] (req, res) {
    const { id } = req.params
    const data = queryArray(catalogDataBase, id, 'id')
    if (data) {
      catalogDataBase = catalogDataBase.filter(item => item.id !== id)
      res.status(204).end()
    } else {
      res.status(404).json(NOTFOUND)
    }
  },

  [`PUT ${apiPrefix}/content/catalog/:id`] (req, res) {
    const { id } = req.params
    let isExist = false

    const newData = req.body
    const cookie = req.headers.cookie || ''
    const cookies = qs.parse(cookie.replace(/\s/g, ''), { delimiter: ';' })
    const token = JSON.parse(cookies.token)

    const curAuthor = queryArray(authorList, token.id, 'id')
    const newCatalog = { id, name: newData.name, description: newData.description, parent: newData.parent, author: curAuthor }
    newCatalog.avatar = newCatalog.avatar || Mock.Random.image('100x100', Mock.Random.color(), '#757575', 'png', newCatalog.name.substr(0, 1))

    catalogDataBase = catalogDataBase.map((item) => {
      if (item.id === id) {
        isExist = true
        newCatalog.createdate = item.createdate
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

  [`GET ${apiPrefix}/content/links`] (req, res) {
    const { query } = req
    let { pageSize, page } = query
    pageSize = pageSize || 10
    page = page || 1

    let newData = linkDataBase
    res.status(200).json({
      data: newData.slice((page - 1) * pageSize, page * pageSize),
      total: newData.length,
    })
  },

  [`DELETE ${apiPrefix}/content/links`] (req, res) {
    const { ids } = req.body
    linkDataBase = linkDataBase.filter(item => !ids.some(_ => _ === item.id))
    res.status(204).end()
  },

  [`POST ${apiPrefix}/content/link`] (req, res) {
    const newData = req.body
    const cookie = req.headers.cookie || ''
    const cookies = qs.parse(cookie.replace(/\s/g, ''), { delimiter: ';' })
    const token = JSON.parse(cookies.token)
    const curAuthor = queryArray(authorList, token.id, 'id')
    const newLink = { id: Mock.mock('@id'), name: newData.name, description: newData.description, catalog: newData.catalog, author: curAuthor, createdate: Mock.mock('@now') }
    newLink.avatar = newLink.avatar || Mock.Random.image('100x100', Mock.Random.color(), '#757575', 'png', newLink.name.substr(0, 1))

    linkDataBase.unshift(newLink)

    res.status(200).end()
  },

  [`GET ${apiPrefix}/content/link/:id`] (req, res) {
    const { id } = req.params
    const data = queryArray(linkDataBase, id, 'id')
    if (data) {
      const result = { link: data }
      res.status(200).json(result)
    } else {
      res.status(404).json(NOTFOUND)
    }
  },

  [`DELETE ${apiPrefix}/content/link/:id`] (req, res) {
    const { id } = req.params
    const data = queryArray(linkDataBase, id, 'id')
    if (data) {
      linkDataBase = linkDataBase.filter(item => item.id !== id)
      res.status(204).end()
    } else {
      res.status(404).json(NOTFOUND)
    }
  },

  [`PUT ${apiPrefix}/content/link/:id`] (req, res) {
    const { id } = req.params
    let isExist = false

    const newData = req.body
    const cookie = req.headers.cookie || ''
    const cookies = qs.parse(cookie.replace(/\s/g, ''), { delimiter: ';' })
    const token = JSON.parse(cookies.token)

    const curAuthor = queryArray(authorList, token.id, 'id')
    const newLink = { id, name: newData.name, description: newData.description, catalog: newData.catalog, author: curAuthor }
    newLink.avatar = newLink.avatar || Mock.Random.image('100x100', Mock.Random.color(), '#757575', 'png', newLink.name.substr(0, 1))

    linkDataBase = linkDataBase.map((item) => {
      if (item.id === id) {
        isExist = true
        newLink.createdate = item.createdate
        return Object.assign({}, item, newLink)
      }

      return item
    })

    if (isExist) {
      res.status(201).end()
    } else {
      res.status(404).json(NOTFOUND)
    }
  },

  [`GET ${apiPrefix}/content/medias`] (req, res) {
    const { query } = req
    let { pageSize, page } = query
    pageSize = pageSize || 10
    page = page || 1

    let newData = mediaDataBase
    res.status(200).json({
      data: newData.slice((page - 1) * pageSize, page * pageSize),
      total: newData.length,
    })
  },

  [`DELETE ${apiPrefix}/content/medias`] (req, res) {
    const { ids } = req.body
    mediaDataBase = mediaDataBase.filter(item => !ids.some(_ => _ === item.id))
    res.status(204).end()
  },

  [`POST ${apiPrefix}/content/media`] (req, res) {
    const newData = req.body
    const cookie = req.headers.cookie || ''
    const cookies = qs.parse(cookie.replace(/\s/g, ''), { delimiter: ';' })
    const token = JSON.parse(cookies.token)
    const curAuthor = queryArray(authorList, token.id, 'id')
    const newMedia = { id: Mock.mock('@id'), name: newData.name, description: newData.description, catalog: newData.catalog, author: curAuthor, createdate: Mock.mock('@now') }
    newMedia.avatar = newMedia.avatar || Mock.Random.image('100x100', Mock.Random.color(), '#757575', 'png', newMedia.name.substr(0, 1))

    mediaDataBase.unshift(newMedia)

    res.status(200).end()
  },

  [`GET ${apiPrefix}/content/media/:id`] (req, res) {
    const { id } = req.params
    const data = queryArray(mediaDataBase, id, 'id')
    if (data) {
      const result = { media: data }
      res.status(200).json(result)
    } else {
      res.status(404).json(NOTFOUND)
    }
  },

  [`DELETE ${apiPrefix}/content/media/:id`] (req, res) {
    const { id } = req.params
    const data = queryArray(mediaDataBase, id, 'id')
    if (data) {
      mediaDataBase = mediaDataBase.filter(item => item.id !== id)
      res.status(204).end()
    } else {
      res.status(404).json(NOTFOUND)
    }
  },

  [`PUT ${apiPrefix}/content/media/:id`] (req, res) {
    const { id } = req.params
    let isExist = false

    const newData = req.body
    const cookie = req.headers.cookie || ''
    const cookies = qs.parse(cookie.replace(/\s/g, ''), { delimiter: ';' })
    const token = JSON.parse(cookies.token)

    const curAuthor = queryArray(authorList, token.id, 'id')
    const newMedia = { id, name: newData.name, description: newData.description, catalog: newData.catalog, author: curAuthor }
    newMedia.avatar = newMedia.avatar || Mock.Random.image('100x100', Mock.Random.color(), '#757575', 'png', newMedia.name.substr(0, 1))

    mediaDataBase = mediaDataBase.map((item) => {
      if (item.id === id) {
        isExist = true
        newMedia.createdate = item.createdate
        return Object.assign({}, item, newMedia)
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

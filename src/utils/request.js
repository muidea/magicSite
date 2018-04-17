/* global window */
import axios from 'axios'
import lodash from 'lodash'
import pathToRegexp from 'path-to-regexp'
import { message } from 'antd'

const fetch = (options) => {
  let {
    method = 'get',
    data,
    url,
  } = options

  const cloneData = lodash.cloneDeep(data)

  try {
    let domin = ''
    if (url.match(/[a-zA-z]+:\/\/[^/]*/)) {
      [domin] = url.match(/[a-zA-z]+:\/\/[^/]*/)
      url = url.slice(domin.length)
    }
    const match = pathToRegexp.parse(url)
    url = pathToRegexp.compile(url)(data)
    for (let item of match) {
      if (item instanceof Object && item.name in cloneData) {
        delete cloneData[item.name]
      }
    }
    url = domin + url
  } catch (e) {
    message.error(e.message)
  }

  switch (method.toLowerCase()) {
    case 'get':
      return axios.get(url, { params: cloneData })
    case 'delete':
      return axios.delete(url, { data: cloneData })
    case 'post':
      return axios.post(url, cloneData)
    case 'put':
      return axios.put(url, cloneData)
    case 'patch':
      return axios.patch(url, cloneData)
    default:
      return axios(options)
  }
}

export default function request (options) {
  if (options.url && options.url.indexOf('//') > -1) {
    const origin = `${options.url.split('//')[0]}//${options.url.split('//')[1].split('/')[0]}`
    if (window.location.origin !== origin) {
      options.fetchType = 'JSONP'
    }
  }

  if (options.url) {
    if (options.data) {
      const { id, authToken } = options.data
      let { url } = options
      if (id !== undefined) {
        delete options.data.id
        url = url.replace(':id', id)
      }

      if (authToken !== undefined) {
        delete options.data.authToken
        url = url.concat('?authToken='.concat(authToken))
      }

      options = {
        ...options,
        url,
      }
    }
  }

  console.log(options)

  return fetch(options).then((response) => {
    const { statusText, status } = response
    let { data } = response
    if (data instanceof Array) {
      data = { list: data }
    }

    console.log(data)

    return Promise.resolve({
      success: true,
      message: statusText,
      statusCode: status,
      ...data,
    })
  }).catch((error) => {
    const { response } = error
    let msg
    let statusCode
    if (response && response instanceof Object) {
      const { data, statusText } = response
      statusCode = response.status
      msg = data.message || statusText
    } else {
      statusCode = 600
      msg = error.message || 'Network Error'
    }

    let val = { success: false, statusCode, message: msg }
    return Promise.reject(val)
  })
}

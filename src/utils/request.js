/* global window */
import axios from 'axios'
import lodash from 'lodash'
import pathToRegexp from 'path-to-regexp'
import qs from 'qs'

const successResponse = (message, data) => {
  return { message, data, success: true }
}

const failedResponse = (message, data) => {
  return { message, data, success: false }
}

const exceptionResponse = (message) => {
  return { message, data: {}, success: false }
}

const fetch = (options) => {
  const { method = 'get', data } = options
  let { url } = options

  const cloneData = lodash.cloneDeep(data)

  try {
    let domin = ''
    if (url.match(/[a-zA-z]+:\/\/[^/]*/)) {
      [domin] = url.match(/[a-zA-z]+:\/\/[^/]*/)
      url = url.slice(domin.length)
    }
    const match = pathToRegexp.parse(url)
    url = pathToRegexp.compile(url)(data)
    for (const item of match) {
      if (item instanceof Object && item.name in cloneData) {
        delete cloneData[item.name]
      }
    }
    url = domin + url
  } catch (e) {
    return Promise.resolve(exceptionResponse(e.message))
  }

  try {
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
  } catch (e) {
    return Promise.resolve(exceptionResponse(e.message))
  }
}

export default function request(options) {
  if (options.url) {
    if (options.data) {
      const { id, sessionToken, sessionScope, sessionID } = options.data
      let { url } = options
      if (id !== undefined) {
        delete options.data.id
        url = url.replace(':id', id)
      }

      let param = {}
      if (sessionToken !== undefined) {
        delete options.data.sessionToken
        param = { ...param, sessionToken }
      }
      if (sessionScope !== undefined) {
        delete options.data.sessionScope
        param = { ...param, sessionScope }
      }
      if (sessionID !== undefined) {
        delete options.data.sessionID
        param = { ...param, sessionID }
      }

      const extParam = qs.stringify({ ...param, browserTimestamp: new Date().getTime() })
      if (extParam) {
        url = url.concat('?'.concat(extParam))
      }

      options = {
        ...options,
        url,
      }
    }
  }

  return fetch(options).then((response) => {
    const { statusText, status, data } = response

    let responseMsg = failedResponse(statusText, data)
    if (status === 200) {
      responseMsg = successResponse(statusText, data)
    }

    return Promise.resolve(responseMsg)
  }).catch((error) => {
    const { response } = error
    let msg
    if (response && response instanceof Object) {
      const { statusText } = response
      msg = statusText
    } else {
      msg = error.message || 'Network Error'
    }

    return Promise.resolve(exceptionResponse(msg))
  })
}

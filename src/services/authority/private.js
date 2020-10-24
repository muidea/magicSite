import { request, config } from 'utils'

const { api } = config
const { enumInitPrivateUrl, queryAllPrivateUrl, savePrivateUrl, destroyPrivateUrl } = api

export async function enumInitPrivate(params) {
  return request({
    url: enumInitPrivateUrl,
    method: 'get',
    data: params,
  })
}

export async function queryAllPrivate(params) {
  return request({
    url: queryAllPrivateUrl,
    method: 'get',
    data: params,
  })
}

export async function savePrivate(params) {
  return request({
    url: savePrivateUrl,
    method: 'post',
    data: params,
  })
}

export async function destroyPrivate(params) {
  return request({
    url: destroyPrivateUrl,
    method: 'get',
    data: params,
  })
}

import { request, config } from 'utils'

const { api } = config
const { queryAllPrivateUrl, savePrivateUrl,destoryPrivateUrl } = api

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

export async function destoryPrivate(params) {
  return request({
    url: destoryPrivateUrl,
    method: 'get',
    data: params,
  })
}

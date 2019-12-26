import { request, config } from 'utils'

const { api } = config
const { queryAllAccountUrl, queryAccountUrl, createAccountUrl, deleteAccountUrl, updateAccountUrl } = api

export async function queryAllAccount(params) {
  return request({
    url: queryAllAccountUrl,
    method: 'get',
    data: params,
  })
}

export async function queryAccount(params) {
  return request({
    url: queryAccountUrl,
    method: 'get',
    data: params,
  })
}

export async function createAccount(params) {
  return request({
    url: createAccountUrl,
    method: 'post',
    data: params,
  })
}

export async function deleteAccount(params) {
  return request({
    url: deleteAccountUrl,
    method: 'delete',
    data: params,
  })
}

export async function updateAccount(params) {
  return request({
    url: updateAccountUrl,
    method: 'put',
    data: params,
  })
}

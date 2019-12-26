import { request, config } from 'utils'

const { api } = config
const { queryAllUserUrl, queryUserUrl, createUserUrl, deleteUserUrl, updateUserUrl } = api

export async function queryAllUser(params) {
  return request({
    url: queryAllUserUrl,
    method: 'get',
    data: params,
  })
}

export async function queryUser(params) {
  return request({
    url: queryUserUrl,
    method: 'get',
    data: params,
  })
}

export async function createUser(params) {
  return request({
    url: createUserUrl,
    method: 'post',
    data: params,
  })
}

export async function deleteUser(params) {
  return request({
    url: deleteUserUrl,
    method: 'delete',
    data: params,
  })
}

export async function updateUser(params) {
  return request({
    url: updateUserUrl,
    method: 'put',
    data: params,
  })
}

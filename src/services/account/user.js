import { request, config } from 'utils'

const { api } = config
const { user, users } = api

export async function queryAllUser (params) {
  return request({
    url: users,
    method: 'get',
    data: params,
  })
}

export async function queryUser (params) {
  return request({
    url: user,
    method: 'get',
    data: params,
  })
}

export async function createUser (params) {
  return request({
    url: user.replace(':id', ''),
    method: 'post',
    data: params,
  })
}

export async function deleteUser (params) {
  return request({
    url: user,
    method: 'delete',
    data: params,
  })
}

export async function multiDeleteUser (params) {
  return request({
    url: users,
    method: 'delete',
    data: params,
  })
}

export async function updateUser (params) {
  return request({
    url: user,
    method: 'put',
    data: params,
  })
}

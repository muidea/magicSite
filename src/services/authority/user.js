import { request, config } from 'utils'

const { api } = config
const { authUser, authUsers } = api

export async function queryAllUser (params) {
  return request({
    url: authUsers,
    method: 'get',
    data: params,
  })
}

export async function queryUser (params) {
  return request({
    url: authUser,
    method: 'get',
    data: params,
  })
}

export async function createUser (params) {
  return request({
    url: authUser.replace('/:id', ''),
    method: 'post',
    data: params,
  })
}

export async function deleteUser (params) {
  return request({
    url: authUser,
    method: 'delete',
    data: params,
  })
}

export async function multiDeleteUser (params) {
  return request({
    url: authUsers,
    method: 'delete',
    data: params,
  })
}

export async function updateUser (params) {
  return request({
    url: authUser,
    method: 'put',
    data: params,
  })
}

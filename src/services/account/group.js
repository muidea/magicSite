import { request, config } from 'utils'

const { api } = config
const { group, groups } = api

export async function queryAllGroup (params) {
  return request({
    url: groups,
    method: 'get',
    data: params,
  })
}

export async function queryGroup (params) {
  return request({
    url: group,
    method: 'get',
    data: params,
  })
}

export async function createGroup (params) {
  return request({
    url: group.replace(':id', ''),
    method: 'post',
    data: params,
  })
}

export async function deleteGroup (params) {
  return request({
    url: group,
    method: 'delete',
    data: params,
  })
}

export async function multiDeleteGroup (params) {
  return request({
    url: groups,
    method: 'delete',
    data: params,
  })
}

export async function updateGroup (params) {
  return request({
    url: group,
    method: 'put',
    data: params,
  })
}

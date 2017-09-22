import { request, config } from 'utils'
const { api } = config
const { group, groups } = api

export async function query (params) {
  return request({
    url: group,
    method: 'get',
    data: params,
  })
}

export async function create (params) {
  return request({
    url: group.replace('/:id', ''),
    method: 'post',
    data: params,
  })
}

export async function remove (params) {
  return request({
    url: group,
    method: 'delete',
    data: params,
  })
}

export async function multiRemove (params) {
  return request({
    url: groups,
    method: 'delete',
    data: params,
  })
}

export async function update (params) {
  return request({
    url: group,
    method: 'patch',
    data: params,
  })
}

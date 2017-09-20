import { request, config } from 'utils'
const { api } = config
const { catalog } = api

export async function query (params) {
  return request({
    url: catalog,
    method: 'get',
    data: params,
  })
}

export async function create (params) {
  return request({
    url: catalog.replace('/:id', ''),
    method: 'post',
    data: params,
  })
}

export async function remove (params) {
  return request({
    url: catalog,
    method: 'delete',
    data: params,
  })
}

export async function update (params) {
  return request({
    url: catalog,
    method: 'patch',
    data: params,
  })
}

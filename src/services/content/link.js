import { request, config } from 'utils'
const { api } = config
const { link } = api

export async function query (params) {
  return request({
    url: link,
    method: 'get',
    data: params,
  })
}

export async function create (params) {
  return request({
    url: link.replace('/:id', ''),
    method: 'post',
    data: params,
  })
}

export async function remove (params) {
  return request({
    url: link,
    method: 'delete',
    data: params,
  })
}

export async function update (params) {
  return request({
    url: link,
    method: 'patch',
    data: params,
  })
}

import { request, config } from '../../utils'
const { api } = config
const { media } = api

export async function query (params) {
  return request({
    url: media,
    method: 'get',
    data: params,
  })
}

export async function create (params) {
  return request({
    url: media.replace('/:id', ''),
    method: 'post',
    data: params,
  })
}

export async function remove (params) {
  return request({
    url: media,
    method: 'delete',
    data: params,
  })
}

export async function update (params) {
  return request({
    url: media,
    method: 'patch',
    data: params,
  })
}

import { request, config } from 'utils'

const { api } = config
const { link, links } = api

export async function queryAllLink (params) {
  return request({
    url: links,
    method: 'get',
    data: params,
  })
}

export async function queryLink (params) {
  return request({
    url: link,
    method: 'get',
    data: params,
  })
}

export async function createLink (params) {
  return request({
    url: link.replace(':id', ''),
    method: 'post',
    data: params,
  })
}

export async function deleteLink (params) {
  return request({
    url: link,
    method: 'delete',
    data: params,
  })
}

export async function multiDeleteLink (params) {
  return request({
    url: links,
    method: 'delete',
    data: params,
  })
}

export async function updateLink (params) {
  return request({
    url: link,
    method: 'put',
    data: params,
  })
}

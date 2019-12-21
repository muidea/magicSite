import { request, config } from 'utils'

const { api } = config
const { queryAllMediaUrl, queryMediaUrl,filterMediaUrl,deleteMediaUrl,createMediaUrl,updateMediaUrl } = api

export async function queryAllMedia(params) {
  return request({
    url: queryAllMediaUrl,
    method: 'get',
    data: params,
  })
}

export async function queryMedia(params) {
  return request({
    url: queryMediaUrl,
    method: 'get',
    data: params,
  })
}

export async function filterMedia(params) {
  return request({
    url: filterMediaUrl,
    method: 'get',
    data: params,
  })
}

export async function createMedia(params) {
  return request({
    url: createMediaUrl,
    method: 'post',
    data: params,
  })
}

export async function deleteMedia(params) {
  return request({
    url: deleteMediaUrl,
    method: 'delete',
    data: params,
  })
}

export async function multiDeleteMedia(params) {
  return request({
    url: articles,
    method: 'delete',
    data: params,
  })
}

export async function updateMedia(params) {
  return request({
    url: updateMediaUrl,
    method: 'put',
    data: params,
  })
}

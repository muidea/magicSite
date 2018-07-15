import { request, config } from 'utils'

const { api } = config
const { media, medias, batchAddMedias, fileRegistry } = api

export async function queryAllMedia(params) {
  return request({
    url: medias,
    method: 'get',
    data: params,
  })
}

export async function queryMedia(params) {
  return request({
    url: media,
    method: 'get',
    data: params,
  })
}

export async function createMedia(params) {
  return request({
    url: media.replace(':id', ''),
    method: 'post',
    data: params,
  })
}

export async function deleteMedia(params) {
  return request({
    url: media,
    method: 'delete',
    data: params,
  })
}

export async function multiDeleteMedia(params) {
  return request({
    url: medias,
    method: 'delete',
    data: params,
  })
}

export async function updateMedia(params) {
  return request({
    url: media,
    method: 'put',
    data: params,
  })
}

export async function batchCreateMedia(params) {
  return request({
    url: batchAddMedias,
    method: 'post',
    data: params,
  })
}

export async function downloadMedia(params) {
  return request({
    url: fileRegistry,
    method: 'get',
    data: params,
  })
}

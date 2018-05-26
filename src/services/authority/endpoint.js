import { request, config } from 'utils'

const { api } = config
const { authEndpoint, authEndpoints } = api

export async function queryAllEndpoint (params) {
  return request({
    url: authEndpoints,
    method: 'get',
    data: params,
  })
}

export async function createEndpoint (params) {
  return request({
    url: authEndpoint.replace(':id', ''),
    method: 'post',
    data: params,
  })
}

export async function deleteEndpoint (params) {
  return request({
    url: authEndpoint,
    method: 'delete',
    data: params,
  })
}

export async function updateEndpoint (params) {
  return request({
    url: authEndpoint,
    method: 'put',
    data: params,
  })
}

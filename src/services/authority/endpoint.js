import { request, config } from 'utils'

const { api } = config
const { queryAllEndpointUrl, queryEndpointUrl, createEndpointUrl, deleteEndpointUrl, updateEndpointUrl } = api

export async function queryAllEndpoint(params) {
  return request({
    url: queryAllEndpointUrl,
    method: 'get',
    data: params,
  })
}

export async function queryEndpoint(params) {
  return request({
    url: queryEndpointUrl,
    method: 'get',
    data: params,
  })
}

export async function createEndpoint(params) {
  return request({
    url: createEndpointUrl,
    method: 'post',
    data: params,
  })
}

export async function deleteEndpoint(params) {
  return request({
    url: deleteEndpointUrl,
    method: 'delete',
    data: params,
  })
}

export async function updateEndpoint(params) {
  return request({
    url: updateEndpointUrl,
    method: 'put',
    data: params,
  })
}

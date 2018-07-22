import { request, config } from 'utils'

const { api } = config
const { endpointRegistry, endpointRegistrys } = api

export async function queryAllEndpoint(params) {
  return request({
    url: endpointRegistrys,
    method: 'get',
    data: params,
  })
}

export async function queryEndpoint(params) {
  return request({
    url: endpointRegistry,
    method: 'get',
    data: params,
  })
}

export async function createEndpoint(params) {
  return request({
    url: endpointRegistry.replace(':id', ''),
    method: 'post',
    data: params,
  })
}

export async function deleteEndpoint(params) {
  return request({
    url: endpointRegistry,
    method: 'delete',
    data: params,
  })
}

export async function updateEndpoint(params) {
  return request({
    url: endpointRegistry,
    method: 'put',
    data: params,
  })
}

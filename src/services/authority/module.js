import { request, config } from 'utils'

const { api } = config
const { authModule, authModules } = api

export async function queryAllModule (params) {
  return request({
    url: authModules,
    method: 'get',
    data: params,
  })
}

export async function queryModule (params) {
  return request({
    url: authModule,
    method: 'get',
    data: params,
  })
}

export async function createModule (params) {
  return request({
    url: authModule.replace(':id', ''),
    method: 'post',
    data: params,
  })
}

export async function deleteModule (params) {
  return request({
    url: authModule,
    method: 'delete',
    data: params,
  })
}

export async function multiDeleteModule (params) {
  return request({
    url: authModules,
    method: 'delete',
    data: params,
  })
}

export async function updateModule (params) {
  return request({
    url: authModule,
    method: 'put',
    data: params,
  })
}

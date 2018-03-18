import { request, config } from 'utils'

const { api } = config
const { module, modules } = api

export async function queryAllModule (params) {
  return request({
    url: modules,
    method: 'get',
    data: params,
  })
}

export async function queryModule (params) {
  return request({
    url: module,
    method: 'get',
    data: params,
  })
}

export async function createModule (params) {
  return request({
    url: module.replace(':id', ''),
    method: 'post',
    data: params,
  })
}

export async function deleteModule (params) {
  return request({
    url: module,
    method: 'delete',
    data: params,
  })
}

export async function multiDeleteModule (params) {
  return request({
    url: modules,
    method: 'delete',
    data: params,
  })
}

export async function updateModule (params) {
  return request({
    url: module,
    method: 'put',
    data: params,
  })
}

import { request, config } from 'utils'

const { api } = config
const { modules, module } = api

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

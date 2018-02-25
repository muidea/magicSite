import { request, config } from 'utils'

const { api } = config
const { systemInfo } = api

export async function querySystemInfo (params) {
  return request({
    url: systemInfo,
    method: 'get',
    data: params,
  })
}

export async function updateSystemInfo (params) {
  return request({
    url: systemInfo,
    method: 'put',
    data: params,
  })
}

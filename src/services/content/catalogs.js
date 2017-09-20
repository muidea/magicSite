import { request, config } from 'utils'
const { api } = config
const { catalogs } = api

export async function query (params) {
  return request({
    url: catalogs,
    method: 'get',
    data: params,
  })
}

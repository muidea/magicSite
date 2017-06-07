import { request, config } from '../../utils'
const { api } = config
const { links } = api

export async function query (params) {
  return request({
    url: links,
    method: 'get',
    data: params,
  })
}

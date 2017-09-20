import { request, config } from 'utils'
const { api } = config
const { articles } = api

export async function query (params) {
  return request({
    url: articles,
    method: 'get',
    data: params,
  })
}

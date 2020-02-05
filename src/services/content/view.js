import { request, config } from 'utils'

const { api } = config
const { queryViewUrl } = api

export async function queryView(params) {
  return request({
    url: queryViewUrl,
    method: 'get',
    data: params,
  })
}

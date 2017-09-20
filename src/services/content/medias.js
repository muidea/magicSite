import { request, config } from 'utils'
const { api } = config
const { medias } = api

export async function query (params) {
  return request({
    url: medias,
    method: 'get',
    data: params,
  })
}

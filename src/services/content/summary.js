import { request, config } from 'utils'

const { api } = config
const { summary } = api

export async function querySummary(params) {
  return request({
    url: summary,
    method: 'get',
    data: params,
  })
}

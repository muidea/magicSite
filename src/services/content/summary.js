import { request, config } from 'utils'

const { api } = config
const { querySummary } = api

export async function querySummaryDetail(params) {
  return request({
    url: querySummary,
    method: 'get',
    data: params,
  })
}

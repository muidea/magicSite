import { request, config } from 'utils'

const { api } = config
const { getSummary, querySummary } = api

export async function getSummaryDetail(params) {
  return request({
    url: getSummary,
    method: 'get',
    data: params,
  })
}


export async function querySummaryDetail(params) {
  return request({
    url: querySummary,
    method: 'get',
    data: params,
  })
}

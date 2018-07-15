import { request, config } from 'utils'

const { api } = config
const { summaryDetail } = api

export async function querySummaryDetail(params) {
  return request({
    url: summaryDetail,
    method: 'get',
    data: params,
  })
}

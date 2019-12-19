import { request, config } from 'utils'

const { api } = config
const { systemDashBoardUrl } = api

export async function queryDashboard(params) {
  return request({
    url: systemDashBoardUrl,
    method: 'get',
    data: params,
  })
}

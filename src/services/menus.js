import { request, config } from 'utils'

const { api } = config
const { systemMenus } = api

export async function query(params) {
  return request({
    url: systemMenus,
    method: 'get',
    data: params,
  })
}

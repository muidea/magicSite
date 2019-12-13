import { request, config } from 'utils'

const { api } = config
const { systemInfoUrl, casStatusUrl, casLogoutUrl, casLoginUrl } = api

export async function systemInfo(params) {
  return request({
    url: systemInfoUrl,
    method: 'get',
    data: params,
  })
}

export async function userLogin(params) {
  return request({
    url: casLoginUrl,
    method: 'post',
    data: params,
  })
}

export async function userLogout(params) {
  return request({
    url: casLogoutUrl,
    method: 'delete',
    data: params,
  })
}

export async function userStatus(params) {
  return request({
    url: casStatusUrl,
    method: 'get',
    data: params,
  })
}

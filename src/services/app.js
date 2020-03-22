import { request, config } from 'utils'

const { api } = config
const { systemInfoUrl, systemDashBoardUrl, sessionVerifyUrl, casLogoutUrl, casLoginUrl } = api

export async function systemInfo(params) {
  return request({
    url: systemInfoUrl,
    method: 'get',
    data: params,
  })
}

export async function queryDashboard(params) {
  return request({
    url: systemDashBoardUrl,
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

export async function sessionVerify(params) {
  return request({
    url: sessionVerifyUrl,
    method: 'get',
    data: params,
  })
}

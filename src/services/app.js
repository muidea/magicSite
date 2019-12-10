import { request, config } from 'utils'

const { api } = config
const { userStatusUrl, userLogoutUrl, userLoginUrl } = api

export async function userLogin(params) {
  return request({
    url: userLoginUrl,
    method: 'post',
    data: params,
  })
}

export async function userLogout(params) {
  return request({
    url: userLogoutUrl,
    method: 'delete',
    data: params,
  })
}

export async function userStatus(params) {
  return request({
    url: userStatusUrl,
    method: 'get',
    data: params,
  })
}

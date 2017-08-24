import { request, config } from '../utils'
const { api } = config
const { userStatus, userLogout, userLogin } = api

export async function login (params) {
  return request({
    url: userLogin,
    method: 'post',
    data: params,
  })
}

export async function logout (params) {
  return request({
    url: userLogout,
    method: 'delete',
    data: params,
  })
}

export async function query (params) {  
  return request({
    url: userStatus,
    method: 'get',
    data: params,
  })
}

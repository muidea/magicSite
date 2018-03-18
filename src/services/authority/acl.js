import { request, config } from 'utils'

const { api } = config
const { acl, acls } = api

export async function queryAllAcl (params) {
  return request({
    url: acls,
    method: 'get',
    data: params,
  })
}

export async function queryAcl (params) {
  return request({
    url: acl,
    method: 'get',
    data: params,
  })
}

export async function createAcl (params) {
  return request({
    url: acl.replace(':id', ''),
    method: 'post',
    data: params,
  })
}

export async function deleteAcl (params) {
  return request({
    url: acl,
    method: 'delete',
    data: params,
  })
}

export async function multiDeleteAcl (params) {
  return request({
    url: acls,
    method: 'delete',
    data: params,
  })
}

export async function updateAcl (params) {
  return request({
    url: acl,
    method: 'put',
    data: params,
  })
}

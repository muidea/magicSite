import { request, config } from 'utils'

const { api } = config
const { catalog, catalogs } = api

export async function queryAllCatalog(params) {
  return request({
    url: catalogs,
    method: 'get',
    data: params,
  })
}

export async function queryCatalog(params) {
  return request({
    url: catalog,
    method: 'get',
    data: params,
  })
}

export async function createCatalog(params) {
  return request({
    url: catalog.replace(':id', ''),
    method: 'post',
    data: params,
  })
}

export async function deleteCatalog(params) {
  return request({
    url: catalog,
    method: 'delete',
    data: params,
  })
}

export async function multiDeleteCatalog(params) {
  return request({
    url: catalogs,
    method: 'delete',
    data: params,
  })
}

export async function updateCatalog(params) {
  return request({
    url: catalog,
    method: 'put',
    data: params,
  })
}

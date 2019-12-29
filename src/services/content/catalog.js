import { request, config } from 'utils'

const { api } = config
const { queryAllCatalogUrl, queryCatalogUrl, filterCatalogUrl, deleteCatalogUrl, createCatalogUrl, updateCatalogUrl } = api

export async function queryAllCatalog(params) {
  return request({
    url: queryAllCatalogUrl,
    method: 'get',
    data: params,
  })
}

export async function queryCatalog(params) {
  return request({
    url: queryCatalogUrl,
    method: 'get',
    data: params,
  })
}

export async function filterCatalog(params) {
  return request({
    url: filterCatalogUrl,
    method: 'get',
    data: params,
  })
}

export async function createCatalog(params) {
  return request({
    url: createCatalogUrl,
    method: 'post',
    data: params,
  })
}

export async function deleteCatalog(params) {
  return request({
    url: deleteCatalogUrl,
    method: 'delete',
    data: params,
  })
}

export async function updateCatalog(params) {
  return request({
    url: updateCatalogUrl,
    method: 'put',
    data: params,
  })
}

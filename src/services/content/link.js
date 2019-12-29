import { request, config } from 'utils'

const { api } = config
const { queryAllLinkUrl, queryLinkUrl, filterLinkUrl, deleteLinkUrl, createLinkUrl, updateLinkUrl } = api

export async function queryAllLink(params) {
  return request({
    url: queryAllLinkUrl,
    method: 'get',
    data: params,
  })
}

export async function queryLink(params) {
  return request({
    url: queryLinkUrl,
    method: 'get',
    data: params,
  })
}

export async function filterLink(params) {
  return request({
    url: filterLinkUrl,
    method: 'get',
    data: params,
  })
}

export async function createLink(params) {
  return request({
    url: createLinkUrl,
    method: 'post',
    data: params,
  })
}

export async function deleteLink(params) {
  return request({
    url: deleteLinkUrl,
    method: 'delete',
    data: params,
  })
}

export async function updateLink(params) {
  return request({
    url: updateLinkUrl,
    method: 'put',
    data: params,
  })
}

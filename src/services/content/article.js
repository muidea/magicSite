import { request, config } from 'utils'

const { api } = config
const { queryAllArticleUrl, queryArticleUrl,filterArticleUrl,deleteArticleUrl,createArticleUrl,updateArticleUrl } = api

export async function queryAllArticle(params) {
  return request({
    url: queryAllArticleUrl,
    method: 'get',
    data: params,
  })
}

export async function queryArticle(params) {
  return request({
    url: queryArticleUrl,
    method: 'get',
    data: params,
  })
}

export async function filterArticle(params) {
  return request({
    url: filterArticleUrl,
    method: 'get',
    data: params,
  })
}

export async function createArticle(params) {
  return request({
    url: createArticleUrl,
    method: 'post',
    data: params,
  })
}

export async function deleteArticle(params) {
  return request({
    url: deleteArticleUrl,
    method: 'delete',
    data: params,
  })
}

export async function multiDeleteArticle(params) {
  return request({
    url: articles,
    method: 'delete',
    data: params,
  })
}

export async function updateArticle(params) {
  return request({
    url: updateArticleUrl,
    method: 'put',
    data: params,
  })
}

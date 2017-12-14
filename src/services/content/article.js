import { request, config } from 'utils'

const { api } = config
const { article, articles } = api

export async function queryAllArticle (params) {
  return request({
    url: articles,
    method: 'get',
    data: params,
  })
}

export async function queryArticle (params) {
  return request({
    url: article,
    method: 'get',
    data: params,
  })
}

export async function createArticle (params) {
  return request({
    url: article.replace('/:id', ''),
    method: 'post',
    data: params,
  })
}

export async function deleteArticle (params) {
  return request({
    url: article,
    method: 'delete',
    data: params,
  })
}

export async function multiDeleteArticle (params) {
  return request({
    url: articles,
    method: 'delete',
    data: params,
  })
}

export async function updateArticle (params) {
  return request({
    url: article,
    method: 'put',
    data: params,
  })
}

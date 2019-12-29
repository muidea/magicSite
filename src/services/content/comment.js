import { request, config } from 'utils'

const { api } = config
const { queryAllCommentUrl, queryCommentUrl, filterCommentUrl, deleteCommentUrl, createCommentUrl, updateCommentUrl } = api

export async function queryAllComment(params) {
  return request({
    url: queryAllCommentUrl,
    method: 'get',
    data: params,
  })
}

export async function queryComment(params) {
  return request({
    url: queryCommentUrl,
    method: 'get',
    data: params,
  })
}

export async function filterComment(params) {
  return request({
    url: filterCommentUrl,
    method: 'get',
    data: params,
  })
}

export async function createComment(params) {
  return request({
    url: createCommentUrl,
    method: 'post',
    data: params,
  })
}

export async function deleteComment(params) {
  return request({
    url: deleteCommentUrl,
    method: 'delete',
    data: params,
  })
}

export async function updateComment(params) {
  return request({
    url: updateCommentUrl,
    method: 'put',
    data: params,
  })
}

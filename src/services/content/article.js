import { request, config } from 'utils'
const { api } = config
const { article } = api

export async function query (params) {
  return request({
    url: article,
    method: 'get',
    data: params,
  })
}

export async function create (params) {
  console.log(params)
  return request({
    url: article.replace('/:id', ''),
    method: 'post',
    data: params,
  })
}

export async function remove (params) {
  return request({
    url: article,
    method: 'delete',
    data: params,
  })
}

export async function update (params) {
  return request({
    url: article,
    method: 'patch',
    data: params,
  })
}

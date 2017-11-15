import { request, config } from 'utils'
const { api } = config
const { systemInfo } = api

export async function querySystemInfo (params) {
    return request({
        url: systemInfo,
        method: 'get',
        data: params,
    })
}

export async function create (params) {
}

export async function remove (params) {
}

export async function update (params) {
}

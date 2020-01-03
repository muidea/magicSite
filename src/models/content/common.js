import modelExtend from 'dva-model-extend'
import { notification } from 'antd'
import { queryCatalogTree } from 'services/content/catalog'
import { pageModel } from '../common'

const mergeTree = (cVal, nVal) => {
  nVal.forEach((nv) => {
    const idx = cVal.findIndex((cv) => {
      return nv.id === cv.id
    })

    if (idx === -1) {
      cVal.push(nv)
    }
  })

  return cVal
}

const commonModel = modelExtend(pageModel, {
  state: {
    catalogTree: [],
  },

  effects: {
    * queryCatalogTree({ payload }, { call, put, select }) {
      const { namespace } = payload
      const { sessionInfo } = yield select(_ => _.app)
      let { catalogTree } = yield select(_ => _[`${namespace}`])

      const result = yield call(queryCatalogTree, { ...payload, level: 1, ...sessionInfo })
      const { success, message, data } = result
      if (success) {
        const { errorCode, reason, catalogs } = data
        if (errorCode === 0) {
          if (payload.loadData) {
            catalogTree = mergeTree(catalogTree, catalogs)
          } else {
            catalogTree = catalogs
          }

          yield put({ type: 'updateModelState', payload: { catalogTree } })
        } else {
          notification.error({ message: '错误信息', description: reason })
        }
      } else {
        notification.error({ message: '错误信息', description: message })
      }
    },
  },

  reducers: {
    updateItemState(state, { payload }) {
      return { ...state, ...payload }
    },
  },

})

module.exports = {
  commonModel,
}


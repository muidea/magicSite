import modelExtend from 'dva-model-extend'
import { notification } from 'antd'
import { queryCatalogTree } from 'services/content/catalog'
import { pageModel } from '../common'
import { mergeTree } from '../../utils'

const commonModel = modelExtend(pageModel, {
  state: {
    catalogTree: [],
  },

  effects: {
    * queryCatalogTree({ payload }, { call, put, select }) {
      const { namespace } = payload
      const { sessionInfo } = yield select(_ => _.app)
      let { catalogTree } = yield select(_ => _[`${namespace}`])

      const result = yield call(queryCatalogTree, { ...payload, deepVal: 1, ...sessionInfo })
      const { success, message, data } = result
      if (success) {
        const { errorCode, reason, catalog } = data
        if (errorCode === 0) {
          if (payload.loadData) {
            catalogTree = mergeTree(catalogTree, catalog.subs)
          } else {
            catalogTree = catalog.subs
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


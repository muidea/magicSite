import modelExtend from 'dva-model-extend'
import qs from 'qs'
import { queryAllModule, queryModule } from 'services/module/registry'
import { pageModel } from '../common'

export default modelExtend(pageModel, {
  namespace: 'moduleRegistry',

  state: { selectedRowKeys: [] },

  subscriptions: {
    setup({ dispatch, history }) {
      history.listen((location) => {
        if (location.pathname === '/module/registry') {
          const query = qs.parse(location.search, { ignoreQueryPrefix: true })
          dispatch({
            type: 'queryAllModule',
            payload: { ...query },
          })
        }
      })
    },
  },

  effects: {

    * queryAllModule({ payload }, { call, put, select }) {
      const { authToken } = yield select(_ => _.app)
      const result = yield call(queryAllModule, { ...payload, authToken })
      if (result.success) {
        const { module } = result
        let totalCount = 0
        if (module) {
          totalCount = module.length
        }

        yield put({
          type: 'queryAllSuccess',
          payload: {
            list: module,
            pagination: {
              current: Number(payload.page) || 1,
              pageSize: Number(payload.pageSize) || 10,
              total: Number(totalCount) || 0,
            },
          },
        })
      } else {
        throw result
      }
    },

    * queryModule({ payload }, { call, put, select }) {
      const { authToken } = yield select(_ => _.app)
      const result = yield call(queryModule, { id: payload, authToken })
      const { selectedRowKeys } = yield select(_ => _.user)
      if (result.success) {
        yield put({ type: 'updateModelState', payload: { selectedRowKeys: selectedRowKeys.filter(_ => _ !== payload) } })
      } else {
        throw result
      }
    },
  },

  reducers: { },

})

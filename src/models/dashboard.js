import modelExtend from 'dva-model-extend'
import { query } from 'services/dashboard'
import { model } from 'models/common'

export default modelExtend(model, {
  namespace: 'dashboard',
  state: {
    numbers: [],
    visitTrend: [],
    recentContent: [],
    recentAccount: [],
  },
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(({ pathname }) => {
        if (pathname === '/dashboard' || pathname === '/') {
          dispatch({ type: 'query' })
        }
      })
    },
  },
  effects: {
    * query({
      payload,
    }, { call, put, select }) {
      const { authToken } = yield select(_ => _.app)
      const data = yield call(query, { authToken, ...payload })
      yield put({
        type: 'updateModelState',
        payload: data,
      })
    },
  },
})

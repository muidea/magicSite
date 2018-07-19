import modelExtend from 'dva-model-extend'
import { query } from 'services/dashboard'
import { model } from 'models/common'

export default modelExtend(model, {
  namespace: 'dashboard',
  state: {
    systemSummary: [],
    lastContent: [],
    lastAccount: [],
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
      const { errorCode, reason, ...other } = data
      if (errorCode === 0) {
        yield put({
          type: 'updateModelState',
          payload: { ...other },
        })
      } else {
        throw (reason)
      }
    },
  },
})

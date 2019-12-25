import modelExtend from 'dva-model-extend'
import { notification } from 'antd'
import { queryDashboard } from 'services/app'
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
      const { sessionInfo } = yield select(_ => _.app)
      if (sessionInfo) {
        payload = { ...payload, ...sessionInfo }
      }

      const result = yield call(queryDashboard, { ...payload })
      const { success, message, data } = result
      if (success) {
        const { errorCode, reason, ...other } = data
        if (errorCode === 0) {
          yield put({
            type: 'updateModelState',
            payload: { ...other },
          })
        } else {
          notification.error({ message: '错误信息', description: reason })
        }  
      } else {
        notification.error({ message: '错误信息', description: message })
      }
    },
  },
})

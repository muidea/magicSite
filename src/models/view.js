import modelExtend from 'dva-model-extend'
import { notification } from 'antd'
import { queryView } from 'services/content/view'
import { model } from 'models/common'

export default modelExtend(model, {

  namespace: 'view',

  state: { },

  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(({ pathname }) => {
        if (pathname === '/view') {
          dispatch({ type: 'queryView' })
        }
      })
    },
  },

  effects: {
    * queryView({ payload }, { call, put, select }) {
      const { sessionInfo } = yield select(_ => _.app)
      if (sessionInfo) {
        payload = { ...payload, ...sessionInfo }
      }

      const result = yield call(queryView, { ...payload })
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

import pathToRegexp from 'path-to-regexp'
import { notification } from 'antd'
import { queryArticle } from 'services/content/article'

export default {

  namespace: 'articleDetail',

  state: {
    article: { creater: {} },
  },

  subscriptions: {
    setup({ dispatch, history }) {
      history.listen((location) => {
        const match = pathToRegexp('/content/article/view/:id').exec(location.pathname)
        if (match) {
          dispatch({ type: 'queryArticle', payload: { id: match[1] } })
        }
      })
    },
  },

  effects: {
    * queryArticle({ payload }, { call, put, select }) {
      const { sessionInfo } = yield select(_ => _.app)
      const result = yield call(queryArticle, { ...payload, ...sessionInfo })
      const { success, message, data } = result
      if (success) {
        const { errorCode, reason, article } = data
        if (errorCode === 0) {
          yield put({
            type: 'updateState',
            payload: {
              article,
            },
          })
        } else {
          notification.error({ message: '错误信息', description: reason })
        }
      } else {
        notification.error({ message: '错误信息', description: message })
      }
    },
  },

  reducers: {
    updateState(state, { payload }) {
      return {
        ...state,
        ...payload,
      }
    },
  },
}

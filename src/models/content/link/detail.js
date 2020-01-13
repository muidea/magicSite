import pathToRegexp from 'path-to-regexp'
import { notification } from 'antd'
import { queryLink } from 'services/content/link'

export default {

  namespace: 'linkDetail',

  state: {
    name: '',
    description: '',
    url: '',
    logo: '',
    catalog: [],
    creater: {},
    createDate: '',
  },

  subscriptions: {
    setup({ dispatch, history }) {
      history.listen((location) => {
        const match = pathToRegexp('/content/link/view/:id').exec(location.pathname)
        if (match) {
          dispatch({ type: 'queryLink', payload: { id: match[1] } })
        }
      })
    },
  },

  effects: {
    * queryLink({
      payload,
    }, { call, put, select }) {
      const { sessionInfo } = yield select(_ => _.app)
      const result = yield call(queryLink, { ...payload, ...sessionInfo })
      const { success, message, data } = result
      if (success) {
        const { errorCode, reason, link } = data
        if (errorCode === 0) {
          yield put({
            type: 'queryLinkSuccess',
            payload: {
              link,
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
    queryLinkSuccess(state, { payload }) {
      const { link } = payload
      return {
        ...state,
        ...link,
      }
    },
  },
}

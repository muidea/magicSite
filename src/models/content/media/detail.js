import pathToRegexp from 'path-to-regexp'
import { notification } from 'antd'
import { queryMedia } from 'services/content/media'

export default {

  namespace: 'mediaDetail',

  state: {
    name: '',
    description: '',
    fileUrl: '',
    expiration: 0,
    catalog: [],
    creater: {},
    createDate: '',
  },

  subscriptions: {
    setup({ dispatch, history }) {
      history.listen((location) => {
        const match = pathToRegexp('/content/media/view/:id').exec(location.pathname)
        if (match) {
          dispatch({ type: 'queryMedia', payload: { id: match[1] } })
        }
      })
    },
  },

  effects: {
    * queryMedia({
      payload,
    }, { call, put, select }) {
      const { sessionInfo } = yield select(_ => _.app)
      const result = yield call(queryMedia, { ...payload, ...sessionInfo })
      const { success, message, data } = result
      if (success) {
        const { errorCode, reason, media } = data
        if (errorCode === 0) {
          yield put({
            type: 'queryMediaSuccess',
            payload: {
              media,
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
    queryMediaSuccess(state, { payload }) {
      const { media } = payload
      return {
        ...state,
        ...media,
      }
    },
  },
}

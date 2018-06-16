import pathToRegexp from 'path-to-regexp'
import { queryMedia } from 'services/content/media'

export default {

  namespace: 'mediaDetail',

  state: {
    name: '',
    url: '',
    description: '',
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
      const { authToken } = yield select(_ => _.app)
      const data = yield call(queryMedia, { authToken, ...payload })
      const { success, ...other } = data
      if (success) {
        yield put({
          type: 'queryMediaSuccess',
          payload: {
            data: other,
          },
        })
      } else {
        throw data
      }
    },
  },

  reducers: {
    queryMediaSuccess(state, { payload }) {
      const { data } = payload
      const { media } = data

      return {
        ...state,
        ...media,
      }
    },
  },
}

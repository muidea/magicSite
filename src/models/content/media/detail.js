import pathToRegexp from 'path-to-regexp'
import qs from 'qs'
import { queryMedia, downloadMedia } from 'services/content/media'

export default {

  namespace: 'mediaDetail',

  state: {
    name: '',
    description: '',
    catalog: [],
    createDate: '',
    creater: {},
    fileUrl: '',
    expiration: 0,
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
    /* eslint no-shadow: ["error", { "allow": ["data", "errorCode"] }]*/
    * queryMedia({
      payload,
    }, { call, put, select }) {
      const { authToken } = yield select(_ => _.app)
      const result = yield call(queryMedia, { authToken, ...payload })
      const { errorCode, media } = result
      if (errorCode === 0) {
        const { name, description, catalog, createDate, creater, fileToken, expiration } = media
        const downloadResult = yield call(downloadMedia, { fileToken, authToken })
        const { errorCode, redirectUrl } = downloadResult
        const param = qs.stringify({ authToken })
        if (errorCode === 0) {
          yield put({ type: 'queryMediaSuccess', payload: { name, description, catalog, createDate, creater, expiration, fileUrl: `${redirectUrl}?${param}` } })
        }
      } else {
        throw result
      }
    },
  },

  reducers: {
    queryMediaSuccess(state, { payload }) {
      return {
        ...state,
        ...payload,
      }
    },
  },
}

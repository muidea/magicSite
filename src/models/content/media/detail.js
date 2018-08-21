import pathToRegexp from 'path-to-regexp'
import qs from 'qs'
import { queryMedia, downloadMedia } from 'services/content/media'
import { getSummaryDetail } from 'services/content/summary'

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
    summaryList: [],
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
      const mediaResult = yield call(queryMedia, { authToken, ...payload })
      const { errorCode, media } = mediaResult
      if (errorCode === 0) {
        const { id, name, description, catalog, createDate, creater, fileToken, expiration } = media
        const downloadResult = yield call(downloadMedia, { fileToken, authToken })
        const { errorCode, redirectUrl } = downloadResult
        const param = qs.stringify({ authToken })
        if (errorCode === 0) {
          const summaryResult = yield call(getSummaryDetail, { authToken, id, type: 'media' })
          const { summary } = summaryResult
          yield put({ type: 'queryMediaSuccess', payload: { name, description, catalog, createDate, creater, expiration, fileUrl: `${redirectUrl}?${param}`, summary } })
        }
      } else {
        throw mediaResult
      }
    },
  },

  reducers: {
    queryMediaSuccess(state, { payload }) {
      const { summary, ...other } = payload
      return {
        ...state,
        ...other,
        summaryList: summary,
      }
    },
  },
}

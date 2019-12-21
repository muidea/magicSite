import pathToRegexp from 'path-to-regexp'
import { queryLink } from 'services/content/link'

export default {

  namespace: 'linkDetail',

  state: {
    name: '',
    url: '',
    logo: '',
    catalog: [],
    creater: {},
    createDate: '',
    summaryList: [],
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
      const { authToken } = yield select(_ => _.app)
      const linkResult = yield call(queryLink, { authToken, ...payload })
      const { success, ...other } = linkResult
      if (success) {
        const { link } = other
        const { id } = link
        const summaryResult = yield call(getSummaryDetail, { authToken, id, type: 'link' })
        const { summary } = summaryResult
        yield put({
          type: 'queryLinkSuccess',
          payload: {
            ...other,
            summary,
          },
        })
      } else {
        throw linkResult
      }
    },
  },

  reducers: {
    queryLinkSuccess(state, { payload }) {
      const { link, summary } = payload

      return {
        ...state,
        ...link,
        summaryList: summary,
      }
    },
  },
}

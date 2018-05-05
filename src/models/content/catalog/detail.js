import pathToRegexp from 'path-to-regexp'
import { queryCatalog } from 'services/content/catalog'
import { querySummary } from 'services/content/summary'

export default {

  namespace: 'catalogDetail',

  state: {
    name: '',
    description: '',
    catalog: [],
    creater: {},
    createDate: '',
    summary: [],
  },

  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen((location) => {
        const match = pathToRegexp('/content/catalog/view/:id').exec(location.pathname)
        if (match) {
          dispatch({ type: 'queryCatalog', payload: { id: match[1] } })
        }
      })
    },
  },

  effects: {
    * queryCatalog ({ payload }, { call, put, select }) {
      const { authToken } = yield select(_ => _.app)
      const catalogResult = yield call(queryCatalog, { authToken, ...payload })
      const { success, message, status, ...other } = catalogResult
      if (success) {
        const { catalog } = other
        const { id } = catalog
        const summaryResult = yield call(querySummary, { authToken, id })
        const { summary } = summaryResult
        yield put({
          type: 'queryCatalogSuccess',
          payload: {
            data: other,
            summary,
          },
        })
      } else {
        throw catalogResult
      }
    },
  },

  reducers: {
    queryCatalogSuccess (state, { payload }) {
      const { data, summary } = payload
      const { catalog } = data

      return {
        ...state,
        ...catalog,
        summary,
      }
    },
  },
}

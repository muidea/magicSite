import pathToRegexp from 'path-to-regexp'
import { queryCatalog } from 'services/content/catalog'

export default {

  namespace: 'catalogDetail',

  state: {
    name: '',
    description: '',
    catalog: [],
    creater: {},
    createDate: '',
  },

  subscriptions: {
    setup({ dispatch, history }) {
      history.listen((location) => {
        const match = pathToRegexp('/content/catalog/view/:id').exec(location.pathname)
        if (match) {
          dispatch({ type: 'queryCatalog', payload: { id: match[1] } })
        }
      })
    },
  },

  effects: {
    * queryCatalog({ payload }, { call, put, select }) {
      const { authToken } = yield select(_ => _.app)
      const catalogResult = yield call(queryCatalog, { authToken, ...payload })
      const { success, ...other } = catalogResult
      if (success) {
        const { catalog } = other
        const { id } = catalog
        const summaryResult = yield call(getSummaryDetail, { authToken, id, type: 'catalog' })
        const { summary } = summaryResult
        yield put({
          type: 'queryCatalogSuccess',
          payload: {
            ...other,
            summary,
          },
        })
      } else {
        throw catalogResult
      }
    },
  },

  reducers: {
    queryCatalogSuccess(state, { payload }) {
      const { catalog, summary } = payload

      return {
        ...state,
        ...catalog,
        summaryList: summary,
      }
    },
  },
}

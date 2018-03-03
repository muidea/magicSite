import pathToRegexp from 'path-to-regexp'
import { queryCatalog } from 'services/content/catalog'

export default {

  namespace: 'catalogDetail',

  state: {
    name: '',
    description: '',
    parent: [],
    author: {},
    createdate: '',
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
    * queryCatalog ({
      payload,
    }, { call, put, select }) {
      const { authToken } = yield select(_ => _.app)
      const data = yield call(queryCatalog, { authToken, ...payload })
      const { success, message, status, ...other } = data
      if (success) {
        yield put({
          type: 'queryCatalogSuccess',
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
    queryCatalogSuccess (state, { payload }) {
      const { data } = payload
      const { catalog } = data
      const { name, description, parent, author, createdate } = catalog

      return {
        ...state,
        name,
        description,
        parent,
        author,
        createdate,
      }
    },
  },
}

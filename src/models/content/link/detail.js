import pathToRegexp from 'path-to-regexp'
import { queryCatalog } from 'services/content/link'

export default {

  namespace: 'linkDetail',

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
        const match = pathToRegexp('/content/link/view/:id').exec(location.pathname)
        if (match) {
          dispatch({ type: 'queryCatalog', payload: { id: match[1] } })
        }
      })
    },
  },

  effects: {
    * queryCatalog ({
      payload,
    }, { call, put }) {
      const data = yield call(queryCatalog, payload)
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
      const { link } = data
      const { name, description, parent, author, createdate } = link

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

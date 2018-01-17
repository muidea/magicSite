import pathToRegexp from 'path-to-regexp'
import { queryCatalog } from 'services/content/media'

export default {

  namespace: 'mediaDetail',

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
        const match = pathToRegexp('/content/media/view/:id').exec(location.pathname)
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
      const { media } = data
      const { name, description, parent, author, createdate } = media

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

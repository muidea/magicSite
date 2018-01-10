import pathToRegexp from 'path-to-regexp'
import { queryArticle } from 'services/content/article'

export default {

  namespace: 'articleDetail',

  state: {
    title: '',
    content: '',
    catalog: [],
    author: {},
    createdate: '',
  },

  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen((location) => {
        const match = pathToRegexp('/content/article/view/:id').exec(location.pathname)
        if (match) {
          dispatch({ type: 'queryArticle', payload: { id: match[1] } })
        }
      })
    },
  },

  effects: {
    * queryArticle ({
      payload,
    }, { call, put }) {
      const data = yield call(queryArticle, payload)
      const { success, message, status, ...other } = data
      if (success) {
        yield put({
          type: 'queryArticleSuccess',
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
    queryArticleSuccess (state, { payload }) {
      const { data } = payload
      const { article } = data
      const { title, content, catalog, author, createdate } = article

      return {
        ...state,
        title,
        content,
        catalog,
        author,
        createdate,
      }
    },
  },
}

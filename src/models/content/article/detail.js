import pathToRegexp from 'path-to-regexp'
import { queryArticle } from 'services/content/article'

export default {

  namespace: 'articleDetail',

  state: {
    name: '',
    content: '',
    catalog: [],
    creater: {},
    createDate: '',
  },

  subscriptions: {
    setup({ dispatch, history }) {
      history.listen((location) => {
        const match = pathToRegexp('/content/article/view/:id').exec(location.pathname)
        if (match) {
          dispatch({ type: 'queryArticle', payload: { id: match[1] } })
        }
      })
    },
  },

  effects: {
    * queryArticle({
      payload,
    }, { call, put, select }) {
      const { authToken } = yield select(_ => _.app)
      const data = yield call(queryArticle, { authToken, ...payload })
      const { success, ...other } = data
      if (success) {
        yield put({
          type: 'queryArticleSuccess',
          payload: {
            ...other,
          },
        })
      } else {
        throw data
      }
    },
  },

  reducers: {
    queryArticleSuccess(state, { payload }) {
      const { article } = payload
      const { name, content, catalog, creater, createDate } = article

      return {
        ...state,
        name,
        content,
        catalog,
        creater,
        createDate,
      }
    },
  },
}

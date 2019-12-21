import pathToRegexp from 'path-to-regexp'
import { queryArticle } from 'services/content/article'

export default {

  namespace: 'articleDetail',

  state: {
    title: '',
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
      const articleResult = yield call(queryArticle, { authToken, ...payload })
      const { success, ...other } = articleResult
      if (success) {
        const { article } = other
        const { id } = article
        const summaryResult = yield call(getSummaryDetail, { authToken, id, type: 'article' })
        const { summary } = summaryResult
        yield put({
          type: 'queryArticleSuccess',
          payload: {
            ...other,
            summary,
          },
        })
      } else {
        throw articleResult
      }
    },
  },

  reducers: {
    queryArticleSuccess(state, { payload }) {
      const { article, summary } = payload
      const { title, content, catalog, creater, createDate } = article

      return {
        ...state,
        title,
        content,
        catalog,
        creater,
        createDate,
        summaryList: summary,
      }
    },
  },
}

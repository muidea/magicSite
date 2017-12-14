import pathToRegexp from 'path-to-regexp'
import { queryArticle } from 'services/content/article'

export default {

  namespace: 'articleDetail',

  state: {
    data: {},
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
      return {
        ...state,
        data,
      }
    },
  },
}

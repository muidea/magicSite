import pathToRegexp from 'path-to-regexp'
import { routerRedux } from 'dva/router'
import { queryArticle, createArticle, updateArticle } from 'services/content/article'

export default {

  namespace: 'articleEditor',

  state: {
    article: { content: '', catalog: [] },
    actionType: 'create',
  },

  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen((location) => {
        const match = pathToRegexp('/content/article/edit/:id').exec(location.pathname)
        if (match) {
          dispatch({ type: 'queryArticle', payload: { id: match[1] } })
        } else {
          dispatch({ type: 'resetModel' })
        }
      })
    },
  },

  effects: {
    * resetModel ({
      payload,
    }, { put }) {
      yield put({
        type: 'resetState',
        payload: {
          ...payload,
        },
      })
    },

    * queryArticle ({
      payload,
    }, { call, put, select }) {
      const { authToken } = yield select(_ => _.app)
      const articleData = yield call(queryArticle, { authToken, ...payload })
      const { success, article } = articleData

      if (success) {
        yield put({
          type: 'updateState',
          payload: {
            article,
          },
        })
      } else {
        throw articleData
      }
    },

    * createArticle ({ payload }, { call, put, select }) {
      const { authToken } = yield select(_ => _.app)
      const data = yield call(createArticle, { authToken, ...payload })
      if (data.success) {
        yield put(routerRedux.push('/content/article'))
      } else {
        throw data
      }
    },

    * updateArticle ({ payload }, { call, put, select }) {
      const { authToken } = yield select(_ => _.app)
      const data = yield call(updateArticle, { authToken, ...payload })
      if (data.success) {
        yield put(routerRedux.push('/content/article'))
      } else {
        throw data
      }
    },
  },

  reducers: {
    resetState (state, { payload }) {
      const article = { id: -1, title: '', content: '', catalog: [] }
      return {
        ...state,
        ...payload,
        article,
        actionType: 'create',
      }
    },

    updateState (state, { payload }) {
      const { article } = payload
      return {
        ...state,
        article,
        actionType: 'update',
      }
    },
  },
}

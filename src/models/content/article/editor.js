import pathToRegexp from 'path-to-regexp'
import { routerRedux } from 'dva/router'
import { notification } from 'antd'
import { queryArticle, createArticle, updateArticle } from 'services/content/article'
import { queryCatalogTree } from 'services/content/catalog'
import { mergeTree } from '../../../utils'

export default {

  namespace: 'articleEditor',

  state: {
    catalogTree: [],

    article: { content: '', catalog: [] },
    actionType: 'create',
  },

  subscriptions: {
    setup({ dispatch, history }) {
      history.listen((location) => {
        if (location.pathname.includes('/content/article/')) {
          dispatch({ type: 'queryCatalogTree', payload: { namespace: 'article' } })

          const match = pathToRegexp('/content/article/edit/:id').exec(location.pathname)
          if (match) {
            dispatch({ type: 'queryArticle', payload: { id: match[1] } })
          } else {
            dispatch({ type: 'resetState' })
          }
        }
      })
    },
  },

  effects: {
    * queryArticle({
      payload,
    }, { call, put, select }) {
      const { sessionInfo } = yield select(_ => _.app)
      const articleData = yield call(queryArticle, { ...payload, ...sessionInfo })
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

    * createArticle({ payload }, { call, put, select }) {
      const { sessionInfo } = yield select(_ => _.app)
      const data = yield call(createArticle, { ...payload, ...sessionInfo })
      if (data.success) {
        yield put(routerRedux.push('/content/article'))
      } else {
        throw data
      }
    },

    * updateArticle({ payload }, { call, put, select }) {
      const { sessionInfo } = yield select(_ => _.app)
      const data = yield call(updateArticle, { ...payload, ...sessionInfo })
      if (data.success) {
        yield put(routerRedux.push('/content/article'))
      } else {
        throw data
      }
    },

    * queryCatalogTree({ payload }, { call, put, select }) {
      const { sessionInfo } = yield select(_ => _.app)
      let { catalogTree } = yield select(_ => _.articleEditor)

      const result = yield call(queryCatalogTree, { ...payload, level: 1, ...sessionInfo })
      const { success, message, data } = result
      if (success) {
        const { errorCode, reason, catalogs } = data
        if (errorCode === 0) {
          if (payload.loadData) {
            catalogTree = mergeTree(catalogTree, catalogs)
          } else {
            catalogTree = catalogs
          }

          yield put({ type: 'updateState', payload: { catalogTree } })
        } else {
          notification.error({ message: '错误信息', description: reason })
        }
      } else {
        notification.error({ message: '错误信息', description: message })
      }
    },
  },

  reducers: {
    resetState(state, { payload }) {
      const article = { id: -1, title: '', content: '', catalog: [] }
      return {
        ...state,
        ...payload,
        article,
        actionType: 'create',
      }
    },

    updateState(state, { payload }) {
      return {
        ...state,
        ...payload,
      }
    },
  },
}

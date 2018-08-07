import modelExtend from 'dva-model-extend'
import qs from 'qs'
import { queryAllArticle, deleteArticle, multiDeleteArticle } from 'services/content/article'
import { pageModel } from '../common'

export default modelExtend(pageModel, {
  namespace: 'article',

  state: {
    currentItem: {},
    selectedRowKeys: [],
  },

  subscriptions: {
    setup({ dispatch, history }) {
      history.listen((location) => {
        if (location.pathname === '/content/article') {
          const query = qs.parse(location.search, { ignoreQueryPrefix: true })
          dispatch({
            type: 'queryAllArticle',
            payload: { ...query },
          })
        }
      })
    },
  },

  effects: {
    * queryAllArticle({ payload }, { call, put, select }) {
      const { authToken } = yield select(_ => _.app)
      const data = yield call(queryAllArticle, { ...payload, authToken })
      if (data) {
        const { article } = data
        let totalCount = 0
        if (article) {
          totalCount = article.length
        }
        yield put({
          type: 'queryAllSuccess',
          payload: {
            list: article,
            pagination: {
              current: Number(payload.page) || 1,
              pageSize: Number(payload.pageSize) || 10,
              total: Number(totalCount) || 0,
            },
          },
        })
      }
    },

    * deleteArticle({ payload }, { call, put, select }) {
      const { authToken } = yield select(_ => _.app)
      const data = yield call(deleteArticle, { id: payload, authToken })
      const { selectedRowKeys } = yield select(_ => _.article)
      if (data.success) {
        yield put({ type: 'updateModelState', payload: { selectedRowKeys: selectedRowKeys.filter(_ => _ !== payload) } })
        yield put({ type: 'queryAllArticle', payload: {} })
      } else {
        throw data
      }
    },

    * multiDeleteArticle({ payload }, { call, put, select }) {
      const { authToken } = yield select(_ => _.app)
      const data = yield call(multiDeleteArticle, { authToken, ...payload })
      if (data.success) {
        yield put({ type: 'updateModelState', payload: { selectedRowKeys: [] } })
        yield put({ type: 'queryAllArticle', payload: {} })
      } else {
        throw data
      }
    },
  },

  reducers: { },
})

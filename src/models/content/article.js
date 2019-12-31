import modelExtend from 'dva-model-extend'
import qs from 'qs'
import { notification } from 'antd'
import { queryAllArticle, deleteArticle } from 'services/content/article'
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
      const { sessionInfo } = yield select(_ => _.app)
      let { pagination } = yield select(_ => _.article)
      const { pageNum } = payload
      if (pageNum) {
        pagination = { ...pagination, current: pageNum }

        payload = { ...payload, pageNum, pageSize: pagination.pageSize }
      }

      const result = yield call(queryAllArticle, { ...payload, ...sessionInfo })
      const { success, message, data } = result
      if (success) {
        const { errorCode, reason, total, articles } = data
        if (errorCode === 0) {
          yield put({
            type: 'queryAllSuccess',
            payload: {
              list: articles,
              pagination: {
                ...pagination,
                total: Number(total) || 0,
              },
            },
          })
        } else {
          notification.error({ message: '错误信息', description: reason })
        }
      } else {
        notification.error({ message: '错误信息', description: message })
      }
    },

    * deleteArticle({ payload }, { call, put, select }) {
      const { sessionInfo } = yield select(_ => _.app)
      const data = yield call(deleteArticle, { id: payload, ...sessionInfo })
      const { selectedRowKeys } = yield select(_ => _.article)
      if (data.success) {
        yield put({ type: 'updateModelState', payload: { selectedRowKeys: selectedRowKeys.filter(_ => _ !== payload) } })
        yield put({ type: 'queryAllArticle', payload: {} })
      } else {
        throw data
      }
    },

  },

  reducers: { },
})

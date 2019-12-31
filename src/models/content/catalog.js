import modelExtend from 'dva-model-extend'
import qs from 'qs'
import { notification } from 'antd'
import { queryAllCatalog, queryCatalog, createCatalog, updateCatalog, deleteCatalog } from 'services/content/catalog'
import { pageModel } from '../common'

export default modelExtend(pageModel, {
  namespace: 'catalog',

  state: {
    currentItem: {},
    selectedRowKeys: [],
    modalVisible: false,
    modalType: 'create',
  },

  subscriptions: {
    setup({ dispatch, history }) {
      history.listen((location) => {
        if (location.pathname === '/content/catalog') {
          const query = qs.parse(location.search, { ignoreQueryPrefix: true })
          dispatch({
            type: 'queryAllCatalog',
            payload: { ...query },
          })
        }
      })
    },
  },

  effects: {
    * queryAllCatalog({ payload }, { call, put, select }) {
      const { sessionInfo } = yield select(_ => _.app)
      let { pagination } = yield select(_ => _.catalog)
      const { pageNum } = payload
      if (pageNum) {
        pagination = { ...pagination, current: pageNum }

        payload = { ...payload, pageNum, pageSize: pagination.pageSize }
      }

      const result = yield call(queryAllCatalog, { ...payload, ...sessionInfo })
      const { success, message, data } = result
      if (success) {
        const { errorCode, reason, total, catalogs } = data
        if (errorCode === 0) {
          yield put({
            type: 'queryAllSuccess',
            payload: {
              list: catalogs,
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

    * queryCatalog({ payload }, { call, put, select }) {
      const { sessionInfo } = yield select(_ => _.app)
      const result = yield call(queryCatalog, { id: payload, ...sessionInfo })
      const { success, message, data } = result
      if (success) {
        const { errorCode, reason, catalog } = data
        if (errorCode === 0) {
          yield put({ type: 'updateItemState', payload: { currentItem: catalog } })
        } else {
          notification.error({ message: '错误信息', description: reason })
        }
      } else {
        notification.error({ message: '错误信息', description: message })
      }
    },

    * updateCatalog({ payload }, { call, put, select }) {
      const { sessionInfo } = yield select(_ => _.app)
      const result = yield call(updateCatalog, { ...payload, ...sessionInfo })
      const { success, message, data } = result
      if (success) {
        const { errorCode, reason } = data
        if (errorCode === 0) {
          yield put({ type: 'queryAllCatalog', payload: {} })
        } else {
          notification.error({ message: '错误信息', description: reason })
        }
      } else {
        notification.error({ message: '错误信息', description: message })
      }
    },

    * saveCatalog({ payload }, { call, put, select }) {
      const { sessionInfo } = yield select(_ => _.app)
      const result = yield call(createCatalog, { ...payload, ...sessionInfo })
      const { success, message, data } = result
      if (success) {
        const { errorCode, reason } = data
        if (errorCode === 0) {
          yield put({ type: 'queryAllCatalog', payload: {} })
        } else {
          notification.error({ message: '错误信息', description: reason })
        }
      } else {
        notification.error({ message: '错误信息', description: message })
      }
    },

    * deleteCatalog({ payload }, { call, put, select }) {
      const { sessionInfo } = yield select(_ => _.app)
      const { selectedRowKeys } = yield select(_ => _.catalog)
      const result = yield call(deleteCatalog, { id: payload, ...sessionInfo })
      const { success, message, data } = result
      if (success) {
        const { errorCode, reason } = data
        if (errorCode === 0) {
          yield put({ type: 'updateModelState', payload: { selectedRowKeys: selectedRowKeys.filter(_ => _ !== payload) } })
          yield put({ type: 'queryAllCatalog', payload: {} })
        } else {
          notification.error({ message: '错误信息', description: reason })
        }
      } else {
        notification.error({ message: '错误信息', description: message })
      }
    },

    * submitCatalog({ payload }, { put, select }) {
      const { modalType } = yield select(_ => _.catalog)
      if (modalType === 'create') {
        yield put({ type: 'saveCatalog', payload })
      } else {
        yield put({ type: 'updateCatalog', payload })
      }

      yield put({ type: 'updateItemState', payload: { currentItem: {}, modalVisible: false } })
    },

    * cancelCatalog({ payload }, { put, select }) {
      const { modalType } = yield select(_ => _.catalog)
      if (modalType === 'create') {
        yield put({ type: 'cancelNewCatalog', payload })
      } else {
        yield put({ type: 'cancelUpdateCatalog', payload })
      }
    },

    * invokeNewCatalog({ payload }, { put }) {
      yield put({ type: 'updateItemState', payload: { currentItem: {}, modalVisible: true, modalType: 'create' } })
    },

    * cancelNewCatalog({ payload }, { put }) {
      yield put({ type: 'updateItemState', payload: { currentItem: {}, modalVisible: false, modalType: 'create' } })
    },

    * invokeUpdateCatalog({ payload }, { put }) {
      yield put({ type: 'queryCatalog', payload })
      yield put({ type: 'updateItemState', payload: { currentItem: {}, modalVisible: true, modalType: 'update' } })
    },

    * cancelUpdateCatalog({ payload }, { put }) {
      yield put({ type: 'updateItemState', payload: { currentItem: {}, modalVisible: false, modalType: 'update' } })
    },
  },

  reducers: {
    updateItemState(state, { payload }) {
      return { ...state, ...payload }
    },
  },

})

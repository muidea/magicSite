import modelExtend from 'dva-model-extend'
import { notification } from 'antd'
import { queryAllEndpoint, queryEndpoint, updateEndpoint, createEndpoint, deleteEndpoint } from 'services/authority/endpoint'
import { queryAllPrivate } from 'services/authority/private'
import { pageModel } from '../common'

export default modelExtend(pageModel, {
  namespace: 'endpoint',

  state: {
    currentItem: {},
    privateGroupList: [],
    selectedRowKeys: [],
    modalVisible: false,
    panelVisible: false,
    invokeActionType: 'create',
  },

  subscriptions: {
    setup({ dispatch, history }) {
      history.listen((location) => {
        if (location.pathname === '/authority/endpoint') {
          dispatch({
            type: 'queryAllEndpoint',
            payload: {},
          })
        }
      })
    },
  },

  effects: {
    * queryAllEndpoint({ payload = {} }, { call, put, select }) {
      const { sessionInfo } = yield select(_ => _.app)
      const { pageNum } = payload
      if (!pageNum) {
        payload = { ...payload, pageNum: 1, pageSize: 10 }
      }

      const result = yield call(queryAllEndpoint, { ...payload, ...sessionInfo })
      const { success, message, data } = result
      if (success) {
        const { errorCode, reason, total, endpoints } = data
        if (errorCode === 0) {
          yield put({
            type: 'queryAllSuccess',
            payload: {
              list: endpoints,
              pagination: {
                current: Number(payload.pageNum) || 1,
                pageSize: Number(payload.pageSize) || 10,
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

    * queryEndpoint({ payload }, { call, put, select }) {
      const { sessionInfo } = yield select(_ => _.app)
      const result = yield call(queryEndpoint, { id: payload, ...sessionInfo })
      const { success, message, data } = result
      if (success) {
        const { errorCode, reason, endpoint } = data
        if (errorCode === 0) {
          yield put({ type: 'updateItemState', payload: { currentItem: endpoint } })
        } else {
          notification.error({ message: '错误信息', description: reason })
        }
      } else {
        notification.error({ message: '错误信息', description: message })
      }
    },

    * updateEndpoint({ payload }, { call, put, select }) {
      const { sessionInfo } = yield select(_ => _.app)
      const result = yield call(updateEndpoint, { ...payload, ...sessionInfo })
      const { success, message, data } = result
      if (success) {
        const { errorCode, reason } = data
        if (errorCode === 0) {
          yield put({ type: 'queryAllEndpoint' })
        } else {
          notification.error({ message: '错误信息', description: reason })
        }
      } else {
        notification.error({ message: '错误信息', description: message })
      }
    },

    * saveEndpoint({ payload }, { call, put, select }) {
      const { sessionInfo } = yield select(_ => _.app)
      const result = yield call(createEndpoint, { ...payload, ...sessionInfo })
      const { success, message, data } = result
      if (success) {
        const { errorCode, reason } = data
        if (errorCode === 0) {
          yield put({ type: 'queryAllEndpoint' })
        } else {
          notification.error({ message: '错误信息', description: reason })
        }
      } else {
        notification.error({ message: '错误信息', description: message })
      }
    },

    * deleteEndpoint({ payload }, { call, put, select }) {
      const { sessionInfo } = yield select(_ => _.app)
      const { selectedRowKeys } = yield select(_ => _.endpoint)
      const result = yield call(deleteEndpoint, { id: payload, ...sessionInfo })
      const { success, message, data } = result
      if (success) {
        const { errorCode, reason } = data
        if (errorCode === 0) {
          yield put({ type: 'updateModelState', payload: { selectedRowKeys: selectedRowKeys.filter(_ => _ !== payload) } })
          yield put({ type: 'queryAllEndpoint' })
        } else {
          notification.error({ message: '错误信息', description: reason })
        }
      } else {
        notification.error({ message: '错误信息', description: message })
      }
    },

    * submitEndpoint({ payload }, { put, select }) {
      const { invokeActionType } = yield select(_ => _.endpoint)
      if (invokeActionType === 'create') {
        yield put({ type: 'saveEndpoint', payload })
      } else {
        yield put({ type: 'updateEndpoint', payload })
      }

      yield put({ type: 'updateItemState', payload: { currentItem: {}, modalVisible: false, panelVisible: false } })
    },

    * cancelEndpoint({ payload }, { put, select }) {
      const { invokeActionType } = yield select(_ => _.endpoint)
      if (invokeActionType === 'create') {
        yield put({ type: 'cancelNewEndpoint', payload })
      } else {
        yield put({ type: 'cancelUpdateEndpoint', payload })
      }
    },

    *queryAllPrivate({ payload }, { call, put, select }) {
      const { sessionInfo } = yield select(_ => _.app)
      const result = yield call(queryAllPrivate, { ...payload, ...sessionInfo })
      const { success, data } = result
      if (success) {
        const { errorCode, privates } = data
        if (errorCode === 0) {
          yield put({ type: 'updateItemState', payload: { privateGroupList: privates } })
        }
      }
    },

    * invokeNewEndpoint({ payload }, { put }) {
      yield put({ type: 'queryAllPrivate', payload })
      yield put({ type: 'updateItemState', payload: { currentItem: {}, modalVisible: true, invokeActionType: 'create' } })
    },

    * cancelNewEndpoint({ payload }, { put }) {
      yield put({ type: 'updateItemState', payload: { currentItem: {}, modalVisible: false, invokeActionType: 'create' } })
    },

    * invokeUpdateEndpoint({ payload }, { put }) {
      yield put({ type: 'queryAllPrivate', payload })
      yield put({ type: 'queryEndpoint', payload })
      yield put({ type: 'updateItemState', payload: { currentItem: {}, panelVisible: true, invokeActionType: 'update' } })
    },

    * cancelUpdateEndpoint({ payload }, { put }) {
      yield put({ type: 'updateItemState', payload: { currentItem: {}, panelVisible: false, invokeActionType: 'update' } })
    },
  },

  reducers: {
    updateItemState(state, { payload }) {
      return { ...state, ...payload }
    },
  },

})

import modelExtend from 'dva-model-extend'
import { notification } from 'antd'
import { queryAllAccount, queryAccount, updateAccount, createAccount, deleteAccount } from 'services/authority/account'
import { queryAllPrivate } from 'services/authority/private'
import { pageModel } from '../common'

export default modelExtend(pageModel, {
  namespace: 'account',

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
        if (location.pathname === '/authority/account') {
          dispatch({
            type: 'queryAllAccount',
            payload: {},
          })
        }
      })
    },
  },

  effects: {
    * queryAllAccount({ payload = {} }, { call, put, select }) {
      const { sessionInfo } = yield select(_ => _.app)
      const { pageNum } = payload
      if (!pageNum) {
        payload = { ...payload, pageNum: 1, pageSize: 10 }
      }

      const result = yield call(queryAllAccount, { ...payload, ...sessionInfo })
      const { success, message, data } = result
      if (success) {
        const { errorCode, reason, total, accounts } = data
        if (errorCode === 0) {
          yield put({
            type: 'queryAllSuccess',
            payload: {
              list: accounts,
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

    * queryAccount({ payload }, { call, put, select }) {
      const { sessionInfo } = yield select(_ => _.app)
      const result = yield call(queryAccount, { id: payload, ...sessionInfo })
      const { success, message, data } = result
      if (success) {
        const { errorCode, reason, account } = data
        if (errorCode === 0) {
          yield put({ type: 'updateItemState', payload: { currentItem: account } })
        } else {
          notification.error({ message: '错误信息', description: reason })
        }
      } else {
        notification.error({ message: '错误信息', description: message })
      }
    },

    * updateAccount({ payload }, { call, put, select }) {
      const { sessionInfo } = yield select(_ => _.app)
      const result = yield call(updateAccount, { ...payload, ...sessionInfo })
      const { success, message, data } = result
      if (success) {
        const { errorCode, reason } = data
        if (errorCode === 0) {
          yield put({ type: 'queryAllAccount' })
        } else {
          notification.error({ message: '错误信息', description: reason })
        }
      } else {
        notification.error({ message: '错误信息', description: message })
      }
    },

    * saveAccount({ payload }, { call, put, select }) {
      const { sessionInfo } = yield select(_ => _.app)
      const result = yield call(createAccount, { ...payload, ...sessionInfo })
      const { success, message, data } = result
      if (success) {
        const { errorCode, reason } = data
        if (errorCode === 0) {
          yield put({ type: 'queryAllAccount' })
        } else {
          notification.error({ message: '错误信息', description: reason })
        }
      } else {
        notification.error({ message: '错误信息', description: message })
      }
    },

    * deleteAccount({ payload }, { call, put, select }) {
      const { sessionInfo } = yield select(_ => _.app)
      const { selectedRowKeys } = yield select(_ => _.account)
      const result = yield call(deleteAccount, { id: payload, ...sessionInfo })
      const { success, message, data } = result
      if (success) {
        const { errorCode, reason } = data
        if (errorCode === 0) {
          yield put({ type: 'updateModelState', payload: { selectedRowKeys: selectedRowKeys.filter(_ => _ !== payload) } })
          yield put({ type: 'queryAllAccount' })
        } else {
          notification.error({ message: '错误信息', description: reason })
        }
      } else {
        notification.error({ message: '错误信息', description: message })
      }
    },

    * submitAccount({ payload }, { put, select }) {
      const { invokeActionType } = yield select(_ => _.account)
      if (invokeActionType === 'create') {
        yield put({ type: 'saveAccount', payload })
      } else {
        yield put({ type: 'updateAccount', payload })
      }

      yield put({ type: 'updateItemState', payload: { currentItem: {}, modalVisible: false, panelVisible: false } })
    },

    * cancelAccount({ payload }, { put, select }) {
      const { invokeActionType } = yield select(_ => _.account)
      if (invokeActionType === 'create') {
        yield put({ type: 'cancelNewAccount', payload })
      } else {
        yield put({ type: 'cancelUpdateAccount', payload })
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

    * invokeNewAccount({ payload }, { put }) {
      yield put({ type: 'queryAllPrivate', payload })
      yield put({ type: 'updateItemState', payload: { currentItem: {}, modalVisible: true, invokeActionType: 'create' } })
    },

    * cancelNewAccount({ payload }, { put }) {
      yield put({ type: 'updateItemState', payload: { currentItem: {}, modalVisible: false, invokeActionType: 'create' } })
    },

    * invokeUpdateAccount({ payload }, { put }) {
      yield put({ type: 'queryAllPrivate', payload })
      yield put({ type: 'queryAccount', payload })
      yield put({ type: 'updateItemState', payload: { currentItem: {}, panelVisible: true, invokeActionType: 'update' } })
    },

    * cancelUpdateAccount({ payload }, { put }) {
      yield put({ type: 'updateItemState', payload: { currentItem: {}, panelVisible: false, invokeActionType: 'update' } })
    },
  },

  reducers: {
    updateItemState(state, { payload }) {
      return { ...state, ...payload }
    },
  },

})

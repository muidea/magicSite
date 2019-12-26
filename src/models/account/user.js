import modelExtend from 'dva-model-extend'
import { routerRedux } from 'dva/router'
import { notification } from 'antd'
import { queryAllUser, updateUser, createUser, deleteUser } from 'services/account/user'
import { pageModel } from '../common'

export default modelExtend(pageModel, {
  namespace: 'user',

  state: {
    currentItem: {},
    groupList: [],
    selectedRowKeys: [],
    modalVisible: false,
    modalTitle: '新增用户',
    modalType: 'create',
  },

  subscriptions: {
    setup({ dispatch, history }) {
      history.listen((location) => {
        if (location.pathname === '/account/user') {
          dispatch({
            type: 'queryAllUser',
            payload: {},
          })
        }
      })
    },
  },

  effects: {
    * queryAllUser({ payload = {} }, { call, put, select }) {
      const { sessionInfo } = yield select(_ => _.app)
      const { pageNum } = payload
      if (!pageNum) {
        payload = { ...payload, pageNum: 1, pageSize: 10 }
      }

      const result = yield call(queryAllUser, { ...payload, ...sessionInfo })
      const {success,message, data} = result
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

    * queryUser({ payload }, { call, put, select }) {
      const { sessionInfo } = yield select(_ => _.app)
      const result = yield call(queryUser, { id: payload, ...sessionInfo })
      const {success,message, data} = result
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

    * updateUser({ payload }, { call, put, select }) {
      const { sessionInfo } = yield select(_ => _.app)
      const result = yield call(updateUser, { ...payload, ...sessionInfo })
      const {success,message, data} = result
      if (success) {
        const { errorCode, reason } = data
        if (errorCode === 0) {
          yield put({ type: 'queryAllUser' })
        } else {
          notification.error({ message: '错误信息', description: reason })
        }
      } else {
        notification.error({ message: '错误信息', description: message })
      }
    },

    * saveUser({ payload }, { call, put, select }) {
      const { sessionInfo } = yield select(_ => _.app)
      const result = yield call(createUser, { ...payload, ...sessionInfo })
      const {success,message, data} = result
      if (success) {
        const { errorCode, reason } = data
        if (errorCode === 0) {
          yield put({ type: 'queryAllUser' })
        } else {
          notification.error({ message: '错误信息', description: reason })
        }
      } else {
        notification.error({ message: '错误信息', description: message })
      }
    },

    * deleteUser({ payload }, { call, put, select }) {
      const { sessionInfo } = yield select(_ => _.app)
      const { selectedRowKeys } = yield select(_ => _.user)
      const result = yield call(deleteUser, { id: payload, ...sessionInfo })
      const {success,message, data} = result
      if (success) {
        const { errorCode, reason } = data
        if (errorCode === 0) {
          yield put({ type: 'updateModelState', payload: { selectedRowKeys: selectedRowKeys.filter(_ => _ !== payload) } })
          yield put({ type: 'queryAllUser' })
        } else {
          notification.error({ message: '错误信息', description: reason })
        }
      } else {
        notification.error({ message: '错误信息', description: message })
      }
    },

    * submitUser({ payload }, { put, select }) {
      const { modalType } = yield select(_ => _.user)
      if (modalType === 'create'){
        yield put({ type: 'saveUser', payload })
      } else {
        yield put({ type: 'updateUser', payload })
      }
    },
    
    * cancelUser({ payload }, { put, select }) {
      const { modalType } = yield select(_ => _.user)
      if (modalType === 'create'){
        yield put({ type: 'cancelNewUser', payload })
      } else {
        yield put({ type: 'cancelUpdateUser', payload })
      }
    },

    * invokeNewUser({ payload }, { put }) {
      yield put({ type: 'updateItemState', payload: { currentItem: {}, modalVisible: true, modalTitle:"新增用户", modalType: 'create' } })
    },

    * cancelNewUser({ payload }, { put }) {
      yield put({ type: 'updateItemState', payload: { currentItem: {}, modalVisible: false, modalType: 'create' } })
    },

    * invokeUpdateUser({ payload }, { put }) {
      yield put({ type: 'queryUser', payload })
      yield put({ type: 'updateItemState', payload: { currentItem: {}, modalVisible: true, modalTitle:"修改用户",  modalType: 'update' } })
    },

    * cancelUpdateUser({ payload }, { put }) {
      yield put({ type: 'updateItemState', payload: { currentItem: {}, modalVisible: false, modalType: 'update' } })
    },    
  },

  reducers: {
    updateItemState(state, { payload }) {
      return { ...state, ...payload }
    },

    showModal(state) {
      return { ...state, modalVisible: true }
    },

    hideModal(state) {
      return { ...state, modalVisible: false }
    },
  },

})

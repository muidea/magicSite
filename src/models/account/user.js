import modelExtend from 'dva-model-extend'
import { routerRedux } from 'dva/router'
import { queryAllUser, updateUser, createUser, deleteUser } from 'services/account/user'
import { pageModel } from '../common'

export default modelExtend(pageModel, {
  namespace: 'user',

  state: {
    currentItem: { id: -1, account: '', email: '', name: '', group: [] },
    groupList: [],
    selectedRowKeys: [],
    modalVisible: false,
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
      const { authToken } = yield select(_ => _.app)
      const result = yield call(queryUser, { id: payload, authToken })
      const { selectedRowKeys } = yield select(_ => _.user)
      if (result.success) {
        yield put({ type: 'updateModelState', payload: { selectedRowKeys: selectedRowKeys.filter(_ => _ !== payload) } })
        yield put({ type: 'queryAllUser' })
      } else {
        throw result
      }
    },

    * updateUser({ payload }, { call, put, select }) {
      const { authToken } = yield select(_ => _.app)
      const result = yield call(queryUser, { id: payload, authToken })
      if (result.success) {
        const { user } = result
        yield put({ type: 'showModal', payload: { modalType: 'update', currentItem: user } })
      } else {
        throw result
      }
    },

    * saveUser({ payload }, { call, put, select }) {
      const { authToken } = yield select(_ => _.app)
      const { data } = payload
      const result = yield call(createUser, { authToken, ...data })
      if (result.success) {
        yield put({ type: 'hideModal' })
        yield put(routerRedux.push('/account/user'))
      } else {
        throw data
      }
    },

    * deleteUser({ payload }, { call, put, select }) {
      const { authToken } = yield select(_ => _.app)
      const data = yield call(deleteUser, { id: payload, authToken })
      const { selectedRowKeys } = yield select(_ => _.user)
      if (data.success) {
        yield put({ type: 'updateModelState', payload: { selectedRowKeys: selectedRowKeys.filter(_ => _ !== payload) } })
        yield put({ type: 'queryAllUser' })
      } else {
        throw data
      }
    },

    * multiDeleteUser({ payload }, { call, put }) {
      const data = yield call(multiDeleteUser, payload)
      if (data.success) {
        yield put({ type: 'updateModelState', payload: { selectedRowKeys: [] } })
        yield put({ type: 'queryAllUser' })
      } else {
        throw data
      }
    },
  },

  reducers: {
    updateGroups(state, { payload }) {
      return { ...state, ...payload }
    },

    showModal(state, { payload }) {
      return { ...state, ...payload, modalVisible: true }
    },

    hideModal(state) {
      return { ...state, currentItem: { id: -1, account: '', email: '', name: '', group: [] }, modalVisible: false }
    },
  },

})

import modelExtend from 'dva-model-extend'
import { routerRedux } from 'dva/router'
import { notification } from 'antd'
import { queryAllPrivate, savePrivate, destoryPrivate } from 'services/account/private'
import { pageModel } from '../common'

export default modelExtend(pageModel, {
  namespace: 'privateGroup',

  state: {
    currentItem: { id: -1, account: '', email: '', name: '', group: [] },
    selectedRowKeys: [],
    modalVisible: false,
    modalType: 'create',
  },

  subscriptions: {
    setup({ dispatch, history }) {
      history.listen((location) => {
        if (location.pathname === '/account/private') {
          dispatch({
            type: 'queryAllPrivate',
            payload: {},
          })
        }
      })
    },
  },

  effects: {
    * queryAllPrivate({ payload = {} }, { call, put, select }) {
      const { sessionInfo } = yield select(_ => _.app)
      const { pageNum } = payload
      if (!pageNum) {
        payload = { ...payload, pageNum: 1, pageSize: 10 }
      }

      const result = yield call(queryAllPrivate, { ...payload, ...sessionInfo })
      const {success,message, data} = result
      if (success) {
        const { errorCode, reason, total, privates } = data
        if (errorCode === 0) {
          yield put({
            type: 'queryAllSuccess',
            payload: {
              list: privates,
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

    * queryPrivate({ payload }, { call, put, select }) {
      const { authToken } = yield select(_ => _.app)
      const result = yield call(queryPrivate, { id: payload, authToken })
      const { selectedRowKeys } = yield select(_ => _.private)
      if (result.success) {
        yield put({ type: 'updateModelState', payload: { selectedRowKeys: selectedRowKeys.filter(_ => _ !== payload) } })
        yield put({ type: 'queryAllPrivate' })
      } else {
        throw result
      }
    },

    * savePrivate({ payload }, { call, put, select }) {
      const { authToken } = yield select(_ => _.app)
      const { data } = payload
      const result = yield call(createPrivate, { authToken, ...data })
      if (result.success) {
        yield put({ type: 'hideModal' })
        yield put(routerRedux.push('/account/private'))
      } else {
        throw data
      }
    },

    * destoryPrivate({ payload }, { call, put, select }) {
      const { authToken } = yield select(_ => _.app)
      const data = yield call(deletePrivate, { id: payload, authToken })
      const { selectedRowKeys } = yield select(_ => _.private)
      if (data.success) {
        yield put({ type: 'updateModelState', payload: { selectedRowKeys: selectedRowKeys.filter(_ => _ !== payload) } })
        yield put({ type: 'queryAllPrivate' })
      } else {
        throw data
      }
    },

  },

  reducers: {
    updatePrivates(state, { payload }) {
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

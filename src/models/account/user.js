import modelExtend from 'dva-model-extend'
import { routerRedux } from 'dva/router'
import { queryAllUser, queryUser, createUser, updateUser, deleteUser, multiDeleteUser } from 'services/account/user'
import queryString from 'query-string'
import { pageModel } from '../common'

export default modelExtend(pageModel, {
  namespace: 'user',

  state: {
    currentItem: { id: -1, account: '', password: '', nickName: '', email: '', group: [] },
    selectedRowKeys: [],
    modalVisible: false,
  },

  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen((location) => {
        if (location.pathname === '/account/user') {
          dispatch({
            type: 'queryAllUser',
            payload: queryString.parse(location.search),
          })
        }
      })
    },
  },

  effects: {

    * queryAllUser ({ payload = {} }, { call, put }) {
      const data = yield call(queryAllUser, payload)
      if (data) {
        yield put({
          type: 'queryAllSuccess',
          payload: {
            list: data.data,
            pagination: {
              current: Number(payload.page) || 1,
              pageSize: Number(payload.pageSize) || 10,
              total: data.total,
            },
          },
        })
      }
    },

    * queryUser ({ payload }, { call, put, select }) {
      const data = yield call(queryUser, { id: payload })
      const { selectedRowKeys } = yield select(_ => _.user)
      if (data.success) {
        yield put({ type: 'updateModelState', payload: { selectedRowKeys: selectedRowKeys.filter(_ => _ !== payload) } })
        yield put({ type: 'queryAllUser' })
      } else {
        throw data
      }
    },

    * createUser ({ payload }, { call, put }) {
      const data = yield call(createUser, payload)
      if (data.success) {
        yield put({ type: 'hideModal' })
        yield put(routerRedux.push('/account/user'))
      } else {
        throw data
      }
    },

    * updateUser ({ payload }, { call, put }) {
      const data = yield call(updateUser, payload)
      if (data.success) {
        yield put({ type: 'hideModal' })
        yield put(routerRedux.push('/account/user'))
      } else {
        throw data
      }
    },

    * deleteUser ({ payload }, { call, put, select }) {
      const data = yield call(deleteUser, { id: payload })
      const { selectedRowKeys } = yield select(_ => _.user)
      if (data.success) {
        yield put({ type: 'updateModelState', payload: { selectedRowKeys: selectedRowKeys.filter(_ => _ !== payload) } })
        yield put({ type: 'queryAllUser' })
      } else {
        throw data
      }
    },

    * multiDeleteUser ({ payload }, { call, put }) {
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
    showModal (state, { payload }) {
      return { ...state, ...payload, modalVisible: true }
    },

    hideModal (state) {
      return { ...state, currentItem: { id: -1, account: '', password: '', nickName: '', email: '', group: [] }, modalVisible: false }
    },
  },

})

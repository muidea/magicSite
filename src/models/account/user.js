import modelExtend from 'dva-model-extend'
import { routerRedux } from 'dva/router'
import { queryAllUser, queryUser, createUser, deleteUser, multiDeleteUser } from 'services/account/user'
import queryString from 'query-string'
import { pageModel } from '../common'

export default modelExtend(pageModel, {
  namespace: 'user',

  state: {
    currentItem: { id: -1, account: '', email: '', name: '', group: [] },
    groupList: [{ id: 1, name: 'aa' }, { id: 2, name: 'bb' }],
    selectedRowKeys: [],
    modalVisible: false,
    modalType: 'create',
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

    * queryAllUser ({ payload = {} }, { call, put, select }) {
      const { authToken } = yield select(_ => _.app)
      const data = yield call(queryAllUser, { authToken })
      if (data) {
        const { user } = data
        let totalCount = 0
        if (user) {
          totalCount = user.length
        }

        yield put({
          type: 'queryAllSuccess',
          payload: {
            list: user,
            pagination: {
              current: Number(payload.page) || 1,
              pageSize: Number(payload.pageSize) || 10,
              total: Number(totalCount) || 0,
            },
          },
        })
      }
    },

    * queryUser ({ payload }, { call, put, select }) {
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

    * updateUser ({ payload }, { call, put, select }) {
      const { authToken } = yield select(_ => _.app)
      const result = yield call(queryUser, { id: payload, authToken })
      if (result.success) {
        const { user } = result
        yield put({ type: 'showModal', payload: { modalType: 'update', currentItem: user } })
      } else {
        throw result
      }
    },

    * saveUser ({ payload }, { call, put, select }) {
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

    * deleteUser ({ payload }, { call, put, select }) {
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
      return { ...state, currentItem: { id: -1, account: '', email: '', name: '', group: [] }, modalVisible: false }
    },
  },

})

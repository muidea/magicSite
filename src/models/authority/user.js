import modelExtend from 'dva-model-extend'
import { routerRedux } from 'dva/router'
import { queryAllUser, queryUser, createUser, updateUser, deleteUser, multiDeleteUser } from 'services/authority/user'
import queryString from 'query-string'
import { pageModel } from '../common'

export default modelExtend(pageModel, {
  namespace: 'user',

  state: {
    currentItem: { id: -1, name: '', descrption: '', parent: [] },
    selectedRowKeys: [],
    modalVisible: false,
    modalType: 'create',
  },

  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen((location) => {
        if (location.pathname === '/authority/user') {
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
      const data = yield call(queryUser, { id: payload, authToken })
      const { selectedRowKeys } = yield select(_ => _.user)
      if (data.success) {
        yield put({ type: 'updateModelState', payload: { selectedRowKeys: selectedRowKeys.filter(_ => _ !== payload) } })
        yield put({ type: 'queryAllUser' })
      } else {
        throw data
      }
    },

    * createUser ({ payload }, { call, put, select }) {
      const { authToken } = yield select(_ => _.app)
      const data = yield call(createUser, { authToken, ...payload })
      if (data.success) {
        yield put({ type: 'hideModal' })
        yield put(routerRedux.push('/authority/user'))
      } else {
        throw data
      }
    },

    * updateUser ({ payload }, { call, put, select }) {
      const { authToken } = yield select(_ => _.app)
      const data = yield call(updateUser, { authToken, ...payload })
      if (data.success) {
        yield put({ type: 'hideModal' })
        yield put(routerRedux.push('/authority/user'))
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

    * multiDeleteUser ({ payload }, { call, put, select }) {
      const { authToken } = yield select(_ => _.app)
      const data = yield call(multiDeleteUser, { authToken, ...payload })
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
      return { ...state, currentItem: { id: -1, name: '', descrption: '', parent: [] }, modalVisible: false }
    },
  },

})

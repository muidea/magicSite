import modelExtend from 'dva-model-extend'
import { routerRedux } from 'dva/router'
import qs from 'qs'
import { queryAllEndpoint, queryEndpoint, createEndpoint, updateEndpoint, deleteEndpoint } from 'services/authority/endpoint'
import { queryAllUser } from 'services/account/user'
import { stripArray } from 'utils'
import { pageModel } from '../common'

export default modelExtend(pageModel, {
  namespace: 'endpoint',

  state: {
    currentItem: { id: '', name: '', description: '', user: [], state: 0 },
    userList: [],
    selectedRowKeys: [],
    modalVisible: false,
    modalType: 'create',
  },

  subscriptions: {
    setup({ dispatch, history }) {
      history.listen((location) => {
        if (location.pathname === '/authority/endpoint') {
          const query = qs.parse(location.search, { ignoreQueryPrefix: true })
          dispatch({
            type: 'queryAllEndpoint',
            payload: { ...query },
          })
        }
      })
    },
  },

  effects: {
    * queryAllEndpoint({ payload }, { call, put, select }) {
      const { authToken } = yield select(_ => _.app)
      const result = yield call(queryAllEndpoint, { ...payload, authToken })
      if (result.success) {
        const userResult = yield call(queryAllUser, { authToken })
        const { user } = userResult
        const { endpoint } = result
        let totalCount = 0
        if (endpoint) {
          totalCount = endpoint.length
        }

        yield put({
          type: 'queryAllSuccess',
          payload: {
            list: endpoint,
            pagination: {
              current: Number(payload.page) || 1,
              pageSize: Number(payload.pageSize) || 10,
              total: Number(totalCount) || 0,
            },
          },
        })

        yield put({
          type: 'updateUserList',
          payload: { userList: user },
        })
      }
    },

    * queryEndpoint({ payload }, { call, put, select }) {
      const { authToken } = yield select(_ => _.app)
      const data = yield call(queryEndpoint, { ...payload, authToken })
      const { selectedRowKeys } = yield select(_ => _.endpoint)
      if (data.success) {
        yield put({ type: 'updateModelState', payload: { selectedRowKeys: selectedRowKeys.filter(_ => _ !== payload) } })
        yield put({ type: 'queryAllEndpoint' })
      } else {
        throw data
      }
    },

    * createEndpoint({ payload }, { call, put, select }) {
      const { authToken } = yield select(_ => _.app)
      const { data } = payload
      const { user, status } = data

      const result = yield call(createEndpoint, { authToken, ...data, user: stripArray(user), status: status.id })
      if (result.success) {
        yield put({ type: 'hideModal' })
        yield put(routerRedux.push('/authority/endpoint'))
      } else {
        throw data
      }
    },

    * updateEndpoint({ payload }, { call, put, select }) {
      const { authToken } = yield select(_ => _.app)
      const { data } = payload
      const { user, status } = data

      const result = yield call(updateEndpoint, { authToken, ...data, id: data.id, user: stripArray(user), status: status.id })
      if (result.success) {
        yield put({ type: 'hideModal' })
        yield put(routerRedux.push('/authority/endpoint'))
      } else {
        throw data
      }
    },

    * deleteEndpoint({ payload }, { call, put, select }) {
      const { authToken } = yield select(_ => _.app)
      const data = yield call(deleteEndpoint, { ...payload, authToken })
      const { selectedRowKeys } = yield select(_ => _.endpoint)
      if (data.success) {
        yield put({ type: 'updateModelState', payload: { selectedRowKeys: selectedRowKeys.filter(_ => _ !== payload) } })
        yield put({ type: 'queryAllEndpoint' })
      } else {
        throw data
      }
    },
  },

  reducers: {
    updateUserList(state, { payload }) {
      return { ...state, ...payload }
    },

    showModal(state, { payload }) {
      return { ...state, ...payload, modalVisible: true }
    },

    hideModal(state) {
      return { ...state, currentItem: { id: '', name: '', description: '', user: [], state: 0 }, modalVisible: false }
    },
  },
})

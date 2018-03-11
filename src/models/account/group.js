import modelExtend from 'dva-model-extend'
import { routerRedux } from 'dva/router'
import { queryAllGroup, queryGroup, createGroup, updateGroup, deleteGroup, multiDeleteGroup } from 'services/account/group'
import queryString from 'query-string'
import { pageModel } from '../common'

export default modelExtend(pageModel, {
  namespace: 'group',

  state: {
    currentItem: { id: -1, name: '', descrption: '', catalog: 0 },
    selectedRowKeys: [],
    modalVisible: false,
    modalType: 'create',
  },

  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen((location) => {
        if (location.pathname === '/account/group') {
          dispatch({
            type: 'queryAllGroup',
            payload: queryString.parse(location.search),
          })
        }
      })
    },
  },

  effects: {

    * queryAllGroup ({ payload = {} }, { call, put, select }) {
      const { authToken } = yield select(_ => _.app)
      const data = yield call(queryAllGroup, { authToken })
      if (data) {
        yield put({
          type: 'queryAllSuccess',
          payload: {
            list: data.group,
            pagination: {
              current: Number(payload.page) || 1,
              pageSize: Number(payload.pageSize) || 10,
              total: data.group.length,
            },
          },
        })
      }
    },

    * queryGroup ({ payload }, { call, put, select }) {
      const { authToken } = yield select(_ => _.app)
      const data = yield call(queryGroup, { id: payload, authToken })
      const { selectedRowKeys } = yield select(_ => _.group)
      if (data.success) {
        yield put({ type: 'updateModelState', payload: { selectedRowKeys: selectedRowKeys.filter(_ => _ !== payload) } })
        yield put({ type: 'queryAllGroup' })
      } else {
        throw data
      }
    },

    * createGroup ({ payload }, { call, put, select }) {
      const { authToken } = yield select(_ => _.app)
      const data = yield call(createGroup, { authToken, ...payload })
      if (data.success) {
        yield put({ type: 'hideModal' })
        yield put(routerRedux.push('/account/group'))
      } else {
        throw data
      }
    },

    * updateGroup ({ payload }, { call, put, select }) {
      const { authToken } = yield select(_ => _.app)
      const data = yield call(updateGroup, { authToken, ...payload })
      if (data.success) {
        yield put({ type: 'hideModal' })
        yield put(routerRedux.push('/account/group'))
      } else {
        throw data
      }
    },

    * deleteGroup ({ payload }, { call, put, select }) {
      const { authToken } = yield select(_ => _.app)
      const data = yield call(deleteGroup, { id: payload, authToken })
      const { selectedRowKeys } = yield select(_ => _.group)
      if (data.success) {
        yield put({ type: 'updateModelState', payload: { selectedRowKeys: selectedRowKeys.filter(_ => _ !== payload) } })
        yield put({ type: 'queryAllGroup' })
      } else {
        throw data
      }
    },

    * multiDeleteGroup ({ payload }, { call, put, select }) {
      const { authToken } = yield select(_ => _.app)
      const data = yield call(multiDeleteGroup, { authToken, ...payload })
      if (data.success) {
        yield put({ type: 'updateModelState', payload: { selectedRowKeys: [] } })
        yield put({ type: 'queryAllGroup' })
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
      return { ...state, currentItem: { id: -1, name: '', descrption: '', catalog: 0 }, modalVisible: false }
    },
  },

})

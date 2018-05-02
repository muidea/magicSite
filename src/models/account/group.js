import modelExtend from 'dva-model-extend'
import { routerRedux } from 'dva/router'
import { queryAllGroup, queryGroup, createGroup, updateGroup, deleteGroup, multiDeleteGroup } from 'services/account/group'
import queryString from 'query-string'
import { pageModel } from '../common'

export default modelExtend(pageModel, {
  namespace: 'group',

  state: {
    currentItem: { id: -1, name: '', descrption: '', catalog: { } },
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
        const { group } = data
        let totalCount = 0
        if (group) {
          totalCount = group.length
        }

        yield put({
          type: 'queryAllSuccess',
          payload: {
            list: group,
            pagination: {
              current: Number(payload.page) || 1,
              pageSize: Number(payload.pageSize) || 10,
              total: Number(totalCount) || 0,
            },
          },
        })
      }
    },

    * queryGroup ({ payload }, { call, put, select }) {
      const { authToken } = yield select(_ => _.app)
      const result = yield call(queryGroup, { id: payload, authToken })
      const { selectedRowKeys } = yield select(_ => _.group)
      if (result.success) {
        yield put({ type: 'updateModelState', payload: { selectedRowKeys: selectedRowKeys.filter(_ => _ !== payload) } })
        yield put({ type: 'queryAllGroup' })
      } else {
        throw result
      }
    },

    * updateGroup ({ payload }, { call, put, select }) {
      const { authToken } = yield select(_ => _.app)
      const result = yield call(queryGroup, { id: payload, authToken })
      if (result.success) {
        const { group } = result
        yield put({ type: 'showModal', payload: { modalType: 'update', currentItem: group } })
      } else {
        throw result
      }
    },

    * saveGroup ({ payload }, { call, put, select }) {
      const { authToken } = yield select(_ => _.app)
      const { action, data } = payload
      const result = yield call(action === 'create' ? createGroup : updateGroup, { authToken, ...data })
      if (result.success) {
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

    * multiDeleteGroup ({ payload }, { call, put }) {
      const data = yield call(multiDeleteGroup, payload)
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
      return { ...state, currentItem: { id: -1, name: '', descrption: '', catalog: { } }, modalVisible: false }
    },
  },

})

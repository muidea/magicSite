import modelExtend from 'dva-model-extend'
import { routerRedux } from 'dva/router'
import { queryAllAcl, queryAcl, updateAcl, deleteAcl, multiDeleteAcl } from 'services/authority/acl'
import queryString from 'query-string'
import { pageModel } from '../common'

export default modelExtend(pageModel, {
  namespace: 'acl',

  state: {
    currentItem: { id: -1, url: '', method: '', module: {}, authGroup: {}, state: 0 },
    selectedRowKeys: [],
    modalVisible: false,
  },

  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen((location) => {
        if (location.pathname === '/authority/acl') {
          dispatch({
            type: 'queryAllAcl',
            payload: queryString.parse(location.search),
          })
        }
      })
    },
  },

  effects: {

    * queryAllAcl ({ payload = {} }, { call, put, select }) {
      const { authToken } = yield select(_ => _.app)
      const data = yield call(queryAllAcl, { authToken })
      if (data) {
        const { acl } = data
        let totalCount = 0
        if (acl) {
          totalCount = acl.length
        }

        yield put({
          type: 'queryAllSuccess',
          payload: {
            list: acl,
            pagination: {
              current: Number(payload.page) || 1,
              pageSize: Number(payload.pageSize) || 10,
              total: Number(totalCount) || 0,
            },
          },
        })
      }
    },

    * queryAcl ({ payload }, { call, put, select }) {
      const { authToken } = yield select(_ => _.app)
      const result = yield call(queryAcl, { id: payload, authToken })
      const { selectedRowKeys } = yield select(_ => _.acl)
      if (result.success) {
        yield put({ type: 'updateModelState', payload: { selectedRowKeys: selectedRowKeys.filter(_ => _ !== payload) } })
        yield put({ type: 'queryAllAcl' })
      } else {
        throw result
      }
    },

    * updateAcl ({ payload }, { call, put, select }) {
      const { authToken } = yield select(_ => _.app)
      const result = yield call(queryAcl, { id: payload, authToken })
      if (result.success) {
        const { acl } = result
        yield put({ type: 'showModal', payload: { modalType: 'update', currentItem: acl } })
      } else {
        throw result
      }
    },

    * saveAcl ({ payload }, { call, put, select }) {
      const { authToken } = yield select(_ => _.app)
      const { data } = payload
      const result = yield call(updateAcl, { authToken, ...data })
      if (result.success) {
        yield put({ type: 'hideModal' })
        yield put(routerRedux.push('/authority/acl'))
      } else {
        throw data
      }
    },

    * deleteAcl ({ payload }, { call, put, select }) {
      const { authToken } = yield select(_ => _.app)
      const data = yield call(deleteAcl, { id: payload, authToken })
      const { selectedRowKeys } = yield select(_ => _.acl)
      if (data.success) {
        yield put({ type: 'updateModelState', payload: { selectedRowKeys: selectedRowKeys.filter(_ => _ !== payload) } })
        yield put({ type: 'queryAllAcl' })
      } else {
        throw data
      }
    },

    * multiDeleteAcl ({ payload }, { call, put }) {
      const data = yield call(multiDeleteAcl, payload)
      if (data.success) {
        yield put({ type: 'updateModelState', payload: { selectedRowKeys: [] } })
        yield put({ type: 'queryAllAcl' })
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
      return { ...state, currentItem: { id: -1, url: '', method: '', module: {}, authGroup: {}, state: 0 }, modalVisible: false }
    },
  },
})

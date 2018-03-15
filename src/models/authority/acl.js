import modelExtend from 'dva-model-extend'
import { routerRedux } from 'dva/router'
import { queryAllAcl, queryAcl, createAcl, updateAcl, deleteAcl, multiDeleteAcl } from 'services/authority/acl'
import queryString from 'query-string'
import { pageModel } from '../common'

export default modelExtend(pageModel, {
  namespace: 'acl',

  state: {
    currentItem: { id: -1, url: '', method: '', module: { id: '' }, authgroup: { id: -1 } },
    selectedRowKeys: [],
    modalVisible: false,
    modalType: 'create',
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
      const data = yield call(queryAcl, { id: payload, authToken })
      const { selectedRowKeys } = yield select(_ => _.acl)
      if (data.success) {
        yield put({ type: 'updateModelState', payload: { selectedRowKeys: selectedRowKeys.filter(_ => _ !== payload) } })
        yield put({ type: 'queryAllAcl' })
      } else {
        throw data
      }
    },

    * createAcl ({ payload }, { call, put, select }) {
      const { authToken } = yield select(_ => _.app)
      const data = yield call(createAcl, { authToken, ...payload })
      if (data.success) {
        yield put({ type: 'hideModal' })
        yield put(routerRedux.push('/authority/acl'))
      } else {
        throw data
      }
    },

    * updateAcl ({ payload }, { call, put, select }) {
      const { authToken } = yield select(_ => _.app)
      const data = yield call(updateAcl, { authToken, ...payload })
      if (data.success) {
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

    * multiDeleteAcl ({ payload }, { call, put, select }) {
      const { authToken } = yield select(_ => _.app)
      const data = yield call(multiDeleteAcl, { authToken, ...payload })
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
      return { ...state, currentItem: { id: -1, url: '', method: '', module: { id: '' }, authgroup: { id: -1 } }, modalVisible: false }
    },
  },

})

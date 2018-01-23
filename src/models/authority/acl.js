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

    * queryAllAcl ({ payload = {} }, { call, put }) {
      const data = yield call(queryAllAcl, payload)
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

    * queryAcl ({ payload }, { call, put, select }) {
      const data = yield call(queryAcl, { id: payload })
      const { selectedRowKeys } = yield select(_ => _.acl)
      if (data.success) {
        yield put({ type: 'updateModelState', payload: { selectedRowKeys: selectedRowKeys.filter(_ => _ !== payload) } })
        yield put({ type: 'queryAllAcl' })
      } else {
        throw data
      }
    },

    * createAcl ({ payload }, { call, put }) {
      const data = yield call(createAcl, payload)
      if (data.success) {
        yield put({ type: 'hideModal' })
        yield put(routerRedux.push('/authority/acl'))
      } else {
        throw data
      }
    },

    * updateAcl ({ payload }, { call, put }) {
      const data = yield call(updateAcl, payload)
      if (data.success) {
        yield put({ type: 'hideModal' })
        yield put(routerRedux.push('/authority/acl'))
      } else {
        throw data
      }
    },

    * deleteAcl ({ payload }, { call, put, select }) {
      const data = yield call(deleteAcl, { id: payload })
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
      return { ...state, currentItem: { id: -1, url: '', method: '', module: { id: '' }, authgroup: { id: -1 } }, modalVisible: false }
    },
  },

})

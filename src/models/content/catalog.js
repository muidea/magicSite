import modelExtend from 'dva-model-extend'
import { routerRedux } from 'dva/router'
import qs from 'qs'
import { queryAllCatalog, queryCatalog, createCatalog, updateCatalog, deleteCatalog, multiDeleteCatalog } from 'services/content/catalog'
import { pageModel } from '../common'

export default modelExtend(pageModel, {
  namespace: 'catalog',

  state: {
    currentItem: { id: -1, name: '', descrption: '', catalog: [] },
    selectedRowKeys: [],
    modalVisible: false,
    modalType: 'create',
  },

  subscriptions: {
    setup({ dispatch, history }) {
      history.listen((location) => {
        if (location.pathname === '/content/catalog') {
          const query = qs.parse(location.search, { ignoreQueryPrefix: true })
          dispatch({
            type: 'queryAllCatalog',
            payload: { ...query },
          })
        }
      })
    },
  },

  effects: {

    * queryAllCatalog({ payload }, { call, put, select }) {
      const { authToken } = yield select(_ => _.app)
      const { pageNum } = payload
      if (!pageNum) {
        payload = { ...payload, pageNum: 1, pageSize: 10 }
      }

      const data = yield call(queryAllCatalog, { ...payload, authToken })
      if (data) {
        const { total, catalog } = data

        yield put({
          type: 'queryAllSuccess',
          payload: {
            list: catalog,
            pagination: {
              current: Number(payload.pageNum) || 1,
              pageSize: Number(payload.pageSize) || 10,
              total: Number(total) || 0,
            },
          },
        })
      }
    },

    * queryCatalog({ payload }, { call, put, select }) {
      const { authToken } = yield select(_ => _.app)
      const result = yield call(queryCatalog, { id: payload, authToken })
      const { selectedRowKeys } = yield select(_ => _.catalog)
      if (result.success) {
        yield put({ type: 'updateModelState', payload: { selectedRowKeys: selectedRowKeys.filter(_ => _ !== payload) } })
        yield put({ type: 'queryAllCatalog', payload: {} })
      } else {
        throw result
      }
    },

    * updateCatalog({ payload }, { call, put, select }) {
      const { authToken } = yield select(_ => _.app)
      const result = yield call(queryCatalog, { id: payload, authToken })
      if (result.success) {
        const { catalog } = result
        yield put({ type: 'showModal', payload: { modalType: 'update', currentItem: catalog } })
      } else {
        throw result
      }
    },

    * saveCatalog({ payload }, { call, put, select }) {
      const { authToken } = yield select(_ => _.app)
      const { action, data } = payload
      const result = yield call(action === 'create' ? createCatalog : updateCatalog, { authToken, ...data })
      if (result.success) {
        yield put({ type: 'hideModal' })
        yield put(routerRedux.push('/content/catalog'))
      } else {
        throw data
      }
    },

    * deleteCatalog({ payload }, { call, put, select }) {
      const { authToken } = yield select(_ => _.app)
      const data = yield call(deleteCatalog, { id: payload, authToken })
      const { selectedRowKeys } = yield select(_ => _.catalog)
      if (data.success) {
        yield put({ type: 'updateModelState', payload: { selectedRowKeys: selectedRowKeys.filter(_ => _ !== payload) } })
        yield put({ type: 'queryAllCatalog', payload: {} })
      } else {
        throw data
      }
    },

    * multiDeleteCatalog({ payload }, { call, put }) {
      const data = yield call(multiDeleteCatalog, payload)
      if (data.success) {
        yield put({ type: 'updateModelState', payload: { selectedRowKeys: [] } })
        yield put({ type: 'queryAllCatalog', payload: {} })
      } else {
        throw data
      }
    },
  },

  reducers: {
    showModal(state, { payload }) {
      return { ...state, ...payload, modalVisible: true }
    },

    hideModal(state) {
      return { ...state, currentItem: { id: -1, name: '', descrption: '', catalog: [] }, modalVisible: false }
    },
  },

})

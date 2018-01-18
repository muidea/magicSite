import modelExtend from 'dva-model-extend'
import { routerRedux } from 'dva/router'
import { queryAllCatalog, queryCatalog, createCatalog, updateCatalog, deleteCatalog, multiDeleteCatalog } from 'services/content/catalog'
import queryString from 'query-string'
import { pageModel } from '../common'

export default modelExtend(pageModel, {
  namespace: 'catalog',

  state: {
    currentItem: { id: -1, name: '', descrption: '', parent: [] },
    selectedRowKeys: [],
    modalVisible: false,
    modalType: 'create',
  },

  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen((location) => {
        if (location.pathname === '/content/catalog') {
          dispatch({
            type: 'queryAllCatalog',
            payload: queryString.parse(location.search),
          })
        }
      })
    },
  },

  effects: {

    * queryAllCatalog ({ payload = {} }, { call, put }) {
      const data = yield call(queryAllCatalog, payload)
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

    * queryCatalog ({ payload }, { call, put, select }) {
      const data = yield call(queryCatalog, { id: payload })
      const { selectedRowKeys } = yield select(_ => _.catalog)
      if (data.success) {
        yield put({ type: 'updateModelState', payload: { selectedRowKeys: selectedRowKeys.filter(_ => _ !== payload) } })
        yield put({ type: 'queryAllCatalog' })
      } else {
        throw data
      }
    },

    * createCatalog ({ payload }, { call, put }) {
      const data = yield call(createCatalog, payload)
      if (data.success) {
        yield put({ type: 'hideModal' })
        yield put(routerRedux.push('/content/catalog'))
      } else {
        throw data
      }
    },

    * updateCatalog ({ payload }, { call, put }) {
      const data = yield call(updateCatalog, payload)
      if (data.success) {
        yield put({ type: 'hideModal' })
        yield put(routerRedux.push('/content/catalog'))
      } else {
        throw data
      }
    },

    * deleteCatalog ({ payload }, { call, put, select }) {
      const data = yield call(deleteCatalog, { id: payload })
      const { selectedRowKeys } = yield select(_ => _.catalog)
      if (data.success) {
        yield put({ type: 'updateModelState', payload: { selectedRowKeys: selectedRowKeys.filter(_ => _ !== payload) } })
        yield put({ type: 'queryAllCatalog' })
      } else {
        throw data
      }
    },

    * multiDeleteCatalog ({ payload }, { call, put }) {
      const data = yield call(multiDeleteCatalog, payload)
      if (data.success) {
        yield put({ type: 'updateModelState', payload: { selectedRowKeys: [] } })
        yield put({ type: 'queryAllCatalog' })
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

import modelExtend from 'dva-model-extend'
import { routerRedux } from 'dva/router'
import { queryAllModule, queryModule, createModule, updateModule, deleteModule, multiDeleteModule } from 'services/authority/module'
import queryString from 'query-string'
import { pageModel } from '../common'

export default modelExtend(pageModel, {
  namespace: 'module',

  state: {
    currentItem: { id: -1, name: '', user: [] },
    selectedRowKeys: [],
    modalVisible: false,
  },

  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen((location) => {
        if (location.pathname === '/authority/module') {
          dispatch({
            type: 'queryAllModule',
            payload: queryString.parse(location.search),
          })
        }
      })
    },
  },

  effects: {

    * queryAllModule ({ payload = {} }, { call, put }) {
      const data = yield call(queryAllModule, payload)
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

    * queryModule ({ payload }, { call, put, select }) {
      const data = yield call(queryModule, { id: payload })
      const { selectedRowKeys } = yield select(_ => _.module)
      if (data.success) {
        yield put({ type: 'updateModelState', payload: { selectedRowKeys: selectedRowKeys.filter(_ => _ !== payload) } })
        yield put({ type: 'queryAllModule' })
      } else {
        throw data
      }
    },

    * createModule ({ payload }, { call, put }) {
      const data = yield call(createModule, payload)
      if (data.success) {
        yield put({ type: 'hideModal' })
        yield put(routerRedux.push('/authority/module'))
      } else {
        throw data
      }
    },

    * updateModule ({ payload }, { call, put }) {
      const data = yield call(updateModule, payload)
      if (data.success) {
        yield put({ type: 'hideModal' })
        yield put(routerRedux.push('/authority/module'))
      } else {
        throw data
      }
    },

    * deleteModule ({ payload }, { call, put, select }) {
      const data = yield call(deleteModule, { id: payload })
      const { selectedRowKeys } = yield select(_ => _.module)
      if (data.success) {
        yield put({ type: 'updateModelState', payload: { selectedRowKeys: selectedRowKeys.filter(_ => _ !== payload) } })
        yield put({ type: 'queryAllModule' })
      } else {
        throw data
      }
    },

    * multiDeleteModule ({ payload }, { call, put }) {
      const data = yield call(multiDeleteModule, payload)
      if (data.success) {
        yield put({ type: 'updateModelState', payload: { selectedRowKeys: [] } })
        yield put({ type: 'queryAllModule' })
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
      return { ...state, currentItem: { id: -1, name: '', user: [] }, modalVisible: false }
    },
  },

})

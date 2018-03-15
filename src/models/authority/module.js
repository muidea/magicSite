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

    * queryAllModule ({ payload = {} }, { call, put, select }) {
      const { authToken } = yield select(_ => _.app)
      const data = yield call(queryAllModule, { authToken })
      if (data) {
        const { module } = data
        let totalCount = 0
        if (module) {
          totalCount = module.length
        }

        yield put({
          type: 'queryAllSuccess',
          payload: {
            list: module,
            pagination: {
              current: Number(payload.page) || 1,
              pageSize: Number(payload.pageSize) || 10,
              total: Number(totalCount) || 0,
            },
          },
        })
      }
    },

    * queryModule ({ payload }, { call, put, select }) {
      const { authToken } = yield select(_ => _.app)
      const data = yield call(queryModule, { id: payload, authToken })
      const { selectedRowKeys } = yield select(_ => _.module)
      if (data.success) {
        yield put({ type: 'updateModelState', payload: { selectedRowKeys: selectedRowKeys.filter(_ => _ !== payload) } })
        yield put({ type: 'queryAllModule' })
      } else {
        throw data
      }
    },

    * createModule ({ payload }, { call, put, select }) {
      const { authToken } = yield select(_ => _.app)
      const data = yield call(createModule, { authToken, ...payload })
      if (data.success) {
        yield put({ type: 'hideModal' })
        yield put(routerRedux.push('/authority/module'))
      } else {
        throw data
      }
    },

    * updateModule ({ payload }, { call, put, select }) {
      const { authToken } = yield select(_ => _.app)
      const data = yield call(updateModule, { authToken, ...payload })
      if (data.success) {
        yield put({ type: 'hideModal' })
        yield put(routerRedux.push('/authority/module'))
      } else {
        throw data
      }
    },

    * deleteModule ({ payload }, { call, put, select }) {
      const { authToken } = yield select(_ => _.app)
      const data = yield call(deleteModule, { id: payload, authToken })
      const { selectedRowKeys } = yield select(_ => _.module)
      if (data.success) {
        yield put({ type: 'updateModelState', payload: { selectedRowKeys: selectedRowKeys.filter(_ => _ !== payload) } })
        yield put({ type: 'queryAllModule' })
      } else {
        throw data
      }
    },

    * multiDeleteModule ({ payload }, { call, put, select }) {
      const { authToken } = yield select(_ => _.app)
      const data = yield call(multiDeleteModule, { authToken, ...payload })
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

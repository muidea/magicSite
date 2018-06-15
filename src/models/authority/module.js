import modelExtend from 'dva-model-extend'
import { routerRedux } from 'dva/router'
import { queryAllModule, queryModule, updateModule, deleteModule, multiDeleteModule } from 'services/authority/module'
import { pageModel } from '../common'

export default modelExtend(pageModel, {
  namespace: 'module',

  state: {
    currentItem: { id: '', name: '', description: '', authGroup: [], type: 0, state: 0 },
    selectedRowKeys: [],
    modalVisible: false,
    modalType: 'create',
  },

  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen((location) => {
        if (location.pathname === '/authority/module') {
          dispatch({
            type: 'queryAllModule',
            payload: {},
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
      const result = yield call(queryModule, { id: payload, authToken })
      const { selectedRowKeys } = yield select(_ => _.module)
      if (result.success) {
        yield put({ type: 'updateModelState', payload: { selectedRowKeys: selectedRowKeys.filter(_ => _ !== payload) } })
        yield put({ type: 'queryAllModule' })
      } else {
        throw result
      }
    },

    * updateModuleAuthGroup ({ payload }, { call, put, select }) {
      const { authToken } = yield select(_ => _.app)
      const result = yield call(queryModule, { id: payload, authToken })
      if (result.success) {
        const { module } = result
        yield put({ type: 'showModal', payload: { modalType: 'update', currentItem: module } })
      } else {
        throw result
      }
    },

    * saveModule ({ payload }, { call, put, select }) {
      const { authToken } = yield select(_ => _.app)
      const { data } = payload
      const { userAuthGroup } = data
      let usrAuthGroupList = []
      if (userAuthGroup !== null && userAuthGroup !== undefined) {
        for (let idx = 0; idx < userAuthGroup.length; idx += 1) {
          let item = userAuthGroup[idx]
          let { id, authGroup } = item
          usrAuthGroupList.push({ user: id, authGroup: authGroup.id })
        }
      }

      const result = yield call(updateModule, { authToken, id: data.id, userAuthGroup: usrAuthGroupList })
      if (result.success) {
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
      return { ...state, currentItem: { id: '', name: '', description: '', authGroup: [], type: 0, state: 0 }, modalVisible: false }
    },
  },
})

import { querySystemInfo, updateSystemInfo } from 'services/system/config'

export default {
  namespace: 'config',
  state: {
    modalVisible: false,
    modalType: 'updateSite',
    systemProperty: { },
  },

  subscriptions: {
    setup({ dispatch, history }) {
      history.listen((location) => {
        if (location.pathname === '/system/info') {
          dispatch({
            type: 'querySystemInfo',
            payload: {},
          })
        }
      })
    },

  },

  effects: {
    * querySystemInfo({ payload }, { call, put, select }) {
      const { authToken } = yield select(_ => _.app)
      const data = yield call(querySystemInfo, { authToken, ...payload })
      const { success, ...other } = data

      if (success) {
        yield put({
          type: 'refreshSystemInfo',
          payload: other,
        })
      } else {
        throw data
      }
    },

    * updateSystemInfo({ payload }, { call, put, select }) {
      const { authToken } = yield select(_ => _.app)
      const data = yield call(updateSystemInfo, { authToken, ...payload })
      const { success, ...other } = data

      if (success) {
        yield put({
          type: 'refreshSystemInfo',
          payload: other,
        })
        yield put({ type: 'hideModal' })
      } else {
        throw data
      }
    },

  },

  reducers: {
    refreshSystemInfo(state, { payload }) {
      const { systemProperty } = payload

      return {
        ...state,
        systemProperty,
      }
    },

    showModal(state, { payload }) {
      return { ...state, ...payload, modalVisible: true }
    },

    hideModal(state) {
      return { ...state, modalVisible: false }
    },

  },
}

import { routerRedux } from 'dva/router'
import { parse } from 'qs'
import config from 'config'
import queryString from 'query-string'
import { querySystemInfo, updateSystemInfo } from 'services/system/config'

const { prefix } = config

export default {
  namespace: 'config',
  state: {
    modalVisible: false,
    modalType: 'updateSite',
    systemInfo: {
    },
  },

  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen((location) => {
        if (location.pathname === '/system/info') {
          dispatch({
            type: 'querySystemInfo',
            payload: queryString.parse(location.search),
          })
        }
      })
    },

  },
  
  effects: {
    * querySystemInfo ({
      payload = {},
    }, { call, put }) {
      const data = yield call(querySystemInfo, payload)
      const { success, message, status, ...other } = data
      
      if (success) {
        yield put({
          type: 'refreshSystemInfo',
          payload: other,
        })
      } else {
        throw data
      }
    },

  * updateSystemInfo ({ payload }, { call, put }) {
    const data = yield call(updateSystemInfo, payload)
    const { success, message, status, ...other } = data
    
    if (success) {
      yield put({
        type: 'refreshSystemInfo',
        payload: other,
      })
      yield put({
        type: 'hideModal'
      })

    } else {
      throw data
    }    
  },

  },

  reducers: {
    refreshSystemInfo (state, { payload } ) {
      const { systemInfo } = payload

      return {
        ...state,
        systemInfo: systemInfo,
      }
    },

    showModal (state, { payload }) {
      return { ...state, ...payload, modalVisible: true }
    },

    hideModal (state) {
      return { ...state, modalVisible: false }
    },

  },
}

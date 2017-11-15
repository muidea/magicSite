import { routerRedux } from 'dva/router'
import { parse } from 'qs'
import config from 'config'
import queryString from 'query-string'
import { querySystemInfo } from 'services/system/config'

const { prefix } = config

export default {
  namespace: 'config',
  state: {
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
          type: 'updateSystemInfo',
          payload: other,
        })
      } else {
        throw data
      }
    },

  },

  reducers: {
    updateSystemInfo (state, { payload } ) {
      const { systemInfo } = payload

      return {
        ...state,
        systemInfo,
      }
    },

  },
}

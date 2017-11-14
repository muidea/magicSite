import { routerRedux } from 'dva/router'
import { parse } from 'qs'
import config from 'config'
import queryString from 'query-string'

const { prefix } = config

export default {
  namespace: 'config',
  state: {
    sessionID: '',
    authToken: '',
    accountInfo: {},
  },
  subscriptions: {

    setupHistory ({ dispatch, history }) {
      history.listen((location) => {
      })
    },

    setup ({ dispatch }) {
    },

  },
  effects: {

    * query ({
      payload,
    }, { call, put, select }) {
    },

  },
  reducers: {
    updateState (state, { payload }) {
      return {
        ...state,
        ...payload,
      }
    },
  },
}

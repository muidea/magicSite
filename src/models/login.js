import { routerRedux } from 'dva/router'
import { login } from 'services/login'

export default {
  namespace: 'login',

  state: {},

  effects: {
    * login ({
      payload,
    }, { put, call }) {
      const data = yield call(login, payload)
      const { errorCode, sessionID, authToken } = data
      if (errorCode === 0) {
        yield put({
          type: 'app/updateState',
          payload: {
            sessionID,
            authToken,
          },
        })
        yield put({
          type: 'app/query',
          payload: {
            sessionID,
            authToken,
          },
        })
      } else {
        yield put(routerRedux.push('/login'))
      }
    },
  },

}

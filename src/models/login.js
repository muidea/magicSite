import { routerRedux } from 'dva/router'
import { login } from 'services/login'
import { queryURL } from 'utils'

export default {
  namespace: 'login',

  state: {},

  effects: {
    * login({ payload }, { put, call }) {
      const data = yield call(login, payload)
      const { errorCode } = data
      if (errorCode === 0) {
        const { sessionID, onlineUser } = data
        const { authToken } = onlineUser

        yield put({
          type: 'app/query',
          payload: {
            sessionID,
            authToken,
          },
        })

        const from = queryURL('from')
        if (from) {
          yield put(routerRedux.push(from))
        } else {
          yield put(routerRedux.push('/dashboard'))
        }
      } else {
        yield put(routerRedux.push('/login'))
      }
    },
  },

}

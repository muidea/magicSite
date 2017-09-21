import { routerRedux } from 'dva/router'
import { login } from 'services/login'

export default {
  namespace: 'login',

  state: {},

  effects: {
    * login ({
      payload,
    }, { put, call, select }) {
      const data = yield call(login, payload)
      const { ErrCode, SessionID, AuthToken } = data
      const { locationQuery } = yield select(_ => _.app)
      if (ErrCode == 0) { 
        yield put({ 
          type: 'app/updateState',
          payload: {
            sessionID: SessionID,
            authToken: AuthToken,
          }, })
        const { from } = locationQuery
        yield put({ type: 'app/query' })
        if (from && from !== '/login') {
          yield put(routerRedux.push(from))
        } else {
          yield put(routerRedux.push('/dashboard'))
        }
      } else {
        throw data
      }
    },
  },

}

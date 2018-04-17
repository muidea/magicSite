import pathToRegexp from 'path-to-regexp'
import { queryUser } from 'services/account/user'

export default {

  namespace: 'userDetail',

  state: {
    account: '',
    password: '',
    name: '',
    email: '',
    group: [],
    registerTime: '',
    status: 0,
  },

  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen((location) => {
        const match = pathToRegexp('/account/user/view/:id').exec(location.pathname)
        if (match) {
          dispatch({ type: 'queryUser', payload: { id: match[1] } })
        }
      })
    },
  },

  effects: {
    * queryUser ({ payload }, { call, put, select }) {
      const { authToken } = yield select(_ => _.app)
      const data = yield call(queryUser, { authToken, ...payload })
      const { success, message, status, ...other } = data
      if (success) {
        yield put({
          type: 'queryUserSuccess',
          payload: { data: other },
        })
      } else {
        throw data
      }
    },
  },

  reducers: {
    queryUserSuccess (state, { payload }) {
      const { data } = payload
      const { user } = data

      return {
        ...state,
        ...user,
      }
    },
  },
}

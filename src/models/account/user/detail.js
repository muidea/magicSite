import pathToRegexp from 'path-to-regexp'
import { queryUser } from 'services/account/user'

export default {

  namespace: 'userDetail',

  state: {
    password: '',
    name: '',
    email: '',
    group: [],
    registerTime: '',
    status: {},

    summary: [],
  },

  subscriptions: {
    setup({ dispatch, history }) {
      history.listen((location) => {
        const match = pathToRegexp('/account/user/view/:id').exec(location.pathname)
        if (match) {
          dispatch({ type: 'queryUser', payload: { id: match[1] } })
        }
      })
    },
  },

  effects: {
    * queryUser({ payload }, { call, put, select }) {
      const { id } = payload
      const { authToken } = yield select(_ => _.app)
      const data = yield call(queryUser, { authToken, id })
      const { success, ...other } = data
      if (success) {
        const summaryResult = yield call(querySummaryDetail, { authToken, user: [id] })
        const { summary } = summaryResult
        yield put({
          type: 'queryUserSuccess',
          payload: { data: { ...other, summary } },
        })
      } else {
        throw data
      }
    },
  },

  reducers: {
    queryUserSuccess(state, { payload }) {
      const { data } = payload
      const { user, summary } = data

      return {
        ...state,
        ...user,
        summary,
      }
    },
  },
}

import pathToRegexp from 'path-to-regexp'
import { queryAccount } from 'services/authority/account'

export default {

  namespace: 'AccountDetail',

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
        const match = pathToRegexp('/authority/Account/view/:id').exec(location.pathname)
        if (match) {
          dispatch({ type: 'queryAccount', payload: { id: match[1] } })
        }
      })
    },
  },

  effects: {
    * queryAccount({ payload }, { call, put, select }) {
      const { id } = payload
      const { authToken } = yield select(_ => _.app)
      const data = yield call(queryAccount, { authToken, id })
      const { success, ...other } = data
      if (success) {
        const summaryResult = yield call(querySummaryDetail, { authToken, Account: [id] })
        const { summary } = summaryResult
        yield put({
          type: 'queryAccountSuccess',
          payload: { data: { ...other, summary } },
        })
      } else {
        throw data
      }
    },
  },

  reducers: {
    queryAccountSuccess(state, { payload }) {
      const { data } = payload
      const { Account, summary } = data

      return {
        ...state,
        ...Account,
        summary,
      }
    },
  },
}

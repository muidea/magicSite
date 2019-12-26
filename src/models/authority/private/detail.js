import pathToRegexp from 'path-to-regexp'
import { queryPrivate } from 'services/authority/private'
import { queryAllUser } from 'services/authority/account'

export default {

  namespace: 'privateDetail',

  state: {
    name: '',
    description: '',
    catalog: { id: 0, name: '' },
    accountList: [],
  },

  subscriptions: {
    setup({ dispatch, history }) {
      history.listen((location) => {
        const match = pathToRegexp('/authority/private/view/:id').exec(location.pathname)
        if (match) {
          dispatch({ type: 'queryPrivate', payload: { id: match[1] } })
        }
      })
    },
  },

  effects: {
    * queryPrivate({ payload }, { call, put, select }) {
      const { id } = payload
      const { authToken } = yield select(_ => _.app)
      const data = yield call(queryPrivate, { authToken, id })
      const { success, ...other } = data
      if (success) {
        const accountResult = yield call(queryAllUser, { authToken, private: id })
        const { account } = accountResult
        yield put({
          type: 'queryPrivateSuccess',
          payload: { data: { ...other, accountList: account } },
        })
      } else {
        throw data
      }
    },
  },

  reducers: {
    queryPrivateSuccess(state, { payload }) {
      const { data } = payload
      const { accountList } = data

      return {
        ...state,
        accountList,
      }
    },
  },
}

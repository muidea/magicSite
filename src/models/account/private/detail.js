import pathToRegexp from 'path-to-regexp'
import { queryPrivate } from 'services/account/private'
import { queryAllUser } from 'services/account/user'

export default {

  namespace: 'privateDetail',

  state: {
    name: '',
    description: '',
    catalog: { id: 0, name: '' },
    userList: [],
  },

  subscriptions: {
    setup({ dispatch, history }) {
      history.listen((location) => {
        const match = pathToRegexp('/account/private/view/:id').exec(location.pathname)
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
        const userResult = yield call(queryAllUser, { authToken, private: id })
        const { user } = userResult
        yield put({
          type: 'queryPrivateSuccess',
          payload: { data: { ...other, userList: user } },
        })
      } else {
        throw data
      }
    },
  },

  reducers: {
    queryPrivateSuccess(state, { payload }) {
      const { data } = payload
      const { userList } = data

      return {
        ...state,
        userList,
      }
    },
  },
}

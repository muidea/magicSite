import pathToRegexp from 'path-to-regexp'
import { queryGroup } from 'services/account/group'
import { queryAllUser } from 'services/account/user'

export default {

  namespace: 'groupDetail',

  state: {
    name: '',
    description: '',
    catalog: { id: 0, name: '' },
    userList: [],
  },

  subscriptions: {
    setup({ dispatch, history }) {
      history.listen((location) => {
        const match = pathToRegexp('/account/group/view/:id').exec(location.pathname)
        if (match) {
          dispatch({ type: 'queryGroup', payload: { id: match[1] } })
        }
      })
    },
  },

  effects: {
    * queryGroup({ payload }, { call, put, select }) {
      const { id } = payload
      const { authToken } = yield select(_ => _.app)
      const data = yield call(queryGroup, { authToken, id })
      const { success, ...other } = data
      if (success) {
        const userResult = yield call(queryAllUser, { authToken, group: id })
        const { user } = userResult
        yield put({
          type: 'queryGroupSuccess',
          payload: { data: { ...other, userList: user } },
        })
      } else {
        throw data
      }
    },
  },

  reducers: {
    queryGroupSuccess(state, { payload }) {
      const { data } = payload
      const { group, userList } = data

      return {
        ...state,
        ...group,
        userList,
      }
    },
  },
}

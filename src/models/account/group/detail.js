import pathToRegexp from 'path-to-regexp'
import { queryGroup } from 'services/account/group'

export default {

  namespace: 'groupDetail',

  state: {
    name: '',
    description: '',
    catalog: { id: 0, name: '' },
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
      const { authToken } = yield select(_ => _.app)
      const data = yield call(queryGroup, { authToken, ...payload })
      const { success, ...other } = data
      if (success) {
        yield put({
          type: 'queryGroupSuccess',
          payload: { data: other },
        })
      } else {
        throw data
      }
    },
  },

  reducers: {
    queryGroupSuccess(state, { payload }) {
      const { data } = payload
      const { group } = data

      return {
        ...state,
        ...group,
      }
    },
  },
}

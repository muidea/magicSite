import pathToRegexp from 'path-to-regexp'
import { queryAcl } from 'services/authority/acl'

export default {

  namespace: 'aclDetail',

  state: {
    url: '',
    method: '',
    module: {},
    status: {},
    authGroup: { id: 0, name: '' },
  },

  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen((location) => {
        const match = pathToRegexp('/authority/acl/view/:id').exec(location.pathname)
        if (match) {
          dispatch({ type: 'queryAcl', payload: { id: match[1] } })
        }
      })
    },
  },

  effects: {
    * queryAcl ({ payload }, { call, put, select }) {
      const { authToken } = yield select(_ => _.app)
      const data = yield call(queryAcl, { authToken, ...payload })
      const { success, message, status, ...other } = data
      if (success) {
        yield put({
          type: 'queryAclSuccess',
          payload: { data: other },
        })
      } else {
        throw data
      }
    },
  },

  reducers: {
    queryAclSuccess (state, { payload }) {
      const { data } = payload
      const { acl } = data

      return {
        ...state,
        ...acl,
      }
    },
  },
}

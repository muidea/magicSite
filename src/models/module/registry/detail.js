import pathToRegexp from 'path-to-regexp'
import { queryModule } from 'services/module/registry'

export default {

  namespace: 'moduleDetail',

  state: {
    id: '',
    name: '',
    description: '',
    type: {},
    status: {},
  },

  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen((location) => {
        const match = pathToRegexp('/module/registry/view/:id').exec(location.pathname)
        if (match) {
          dispatch({ type: 'queryModule', payload: { id: match[1] } })
        }
      })
    },
  },

  effects: {
    * queryModule ({ payload }, { call, put, select }) {
      const { authToken } = yield select(_ => _.app)
      const data = yield call(queryModule, { authToken, ...payload })
      const { success, message, status, ...other } = data
      if (success) {
        yield put({
          type: 'queryModuleSuccess',
          payload: { data: other },
        })
      } else {
        throw data
      }
    },
  },

  reducers: {
    queryModuleSuccess (state, { payload }) {
      const { data } = payload
      const { module } = data

      return {
        ...state,
        ...module,
      }
    },
  },
}

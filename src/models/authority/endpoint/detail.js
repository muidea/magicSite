import pathToRegexp from 'path-to-regexp'
import { queryEndpoint } from 'services/authority/endpoint'

export default {

  namespace: 'endpointDetail',

  state: {
    id: '',
    name: '',
    description: '',
    user: [],
    status: 0,
    accessToken: '',
  },

  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen((location) => {
        const match = pathToRegexp('/authority/endpoint/view/:id').exec(location.pathname)
        if (match) {
          dispatch({
            type: 'queryEndpoint',
            payload: { id: match[1] },
          })
        }
      })
    },
  },

  effects: {
    * queryEndpoint ({ payload }, { call, put, select }) {
      const { authToken } = yield select(_ => _.app)
      const data = yield call(queryEndpoint, { authToken, ...payload })
      const { success, message, status, ...other } = data
      if (success) {
        yield put({
          type: 'queryEndpointSuccess',
          payload: { data: other },
        })
      } else {
        throw data
      }
    },
  },

  reducers: {
    queryEndpointSuccess (state, { payload }) {
      const { data } = payload
      const { endpoint } = data

      return {
        ...state,
        ...endpoint,
      }
    },
  },
}

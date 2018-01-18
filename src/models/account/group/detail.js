import pathToRegexp from 'path-to-regexp'
import { queryGroup } from 'services/account/group'

export default {

  namespace: 'groupDetail',

  state: {
    name: '',
    description: '',
    parent: [],
    author: {},
    createdate: '',
  },

  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen((location) => {
        const match = pathToRegexp('/account/group/view/:id').exec(location.pathname)
        if (match) {
          dispatch({ type: 'queryGroup', payload: { id: match[1] } })
        }
      })
    },
  },

  effects: {
    * queryGroup ({
      payload,
    }, { call, put }) {
      const data = yield call(queryGroup, payload)
      const { success, message, status, ...other } = data
      if (success) {
        yield put({
          type: 'queryGroupSuccess',
          payload: {
            data: other,
          },
        })
      } else {
        throw data
      }
    },
  },

  reducers: {
    queryGroupSuccess (state, { payload }) {
      const { data } = payload
      const { group } = data
      const { name, description, parent, author, createdate } = group

      return {
        ...state,
        name,
        description,
        parent,
        author,
        createdate,
      }
    },
  },
}

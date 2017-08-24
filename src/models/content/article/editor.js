import { create } from '../../../services/content/article'

export default {

  namespace: 'articleEditor',

  state: {
    article: {},
    result: {}
  },

  subscriptions: {
    setup ({ dispatch, history }) {
    },
  },
 
  effects: {
    *create ({ payload }, { call, put }) {
      Console.log(payload)
      const data = yield call(create, payload)
      if (data.success) {
        yield put({
          type: 'createSuccess',
          payload: { result: data } 
        })
      } else {
        throw data
      }
    },
  },

  reducers: {
    createSuccess (state, { payload }) {
      const { data } = payload
      return {
        ...state,
        data,
      }
    },
  },
}

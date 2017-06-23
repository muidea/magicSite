import { create } from '../../../services/content/article'

export default {

  namespace: 'articleEditor',

  state: {
    result:{}
  },

  subscriptions: {
    setup ({ dispatch, history }) {
    },
  },

  effects: {
    *create ({ payload }, { call, put }) {
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

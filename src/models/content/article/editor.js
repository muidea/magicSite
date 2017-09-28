import { routerRedux } from 'dva/router'
import { create } from 'services/content/article'

export default {

  namespace: 'articleEditor',

  state: {
    data: {},
  },

  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen(() => {
      })
    },
  },

  effects: {
    *create ({ payload }, { call, put }) {
      const data = yield call(create, payload)
      if (data.success) {
        yield put(routerRedux.push('/content/article'))
      } else {
        throw data
      }
    },

    * update ({ payload }, { select, call, put }) {
      const id = yield select(({ articleEditor }) => articleEditor.currentItem.id)
      const newUser = { ...payload, id }
      const data = yield call(update, newUser)
      if (data.success) {
        yield put({ type: 'hideModal' })
        yield put({ type: 'query' })
      } else {
        throw data
      }
    },    
  },

  reducers: {
  },
}

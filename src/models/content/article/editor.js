import pathToRegexp from 'path-to-regexp'
import { routerRedux } from 'dva/router'
import { query, create } from 'services/content/article'

export default {

  namespace: 'articleEditor',

  state: {
    article: {catalog:[],},
    catalogs: [],
  },

  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen(() => {
        const match = pathToRegexp('/content/article/edit/:id').exec(location.pathname)
        if (match) {
          dispatch({ type: 'query', payload: { id: match[1] } })
        } else {
          dispatch({ type: 'reset', payload: { article:{catalog:[],}, catalogs:[] } })
        }
      })
    },
  },

  effects: {
    *reset ({
      payload,
    }, { put }) {
      yield put({
        type: 'querySuccess',
        payload: {
          ...payload
        },
      })
    },

    *query ({
      payload,
    }, { call, put }) {
      const data = yield call(query, payload)
      const { success, message, status, article, catalogList } = data
      if (success) {
        yield put({
          type: 'querySuccess',
          payload: {
            article,
            catalogList
          },
        })
      } else {
        throw data
      }
    },

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
    querySuccess (state, { payload }) {
      const { article, catalogList } = payload
      let catalogArray = new Array()
      if (catalogList) {
        for (let item of catalogList) {
          catalogArray.unshift({value: item.id, label: item.name})
        }
      }
      return {
        ...state,
        article,
        catalogs: catalogArray,
      }
    },    
  },
}

import pathToRegexp from 'path-to-regexp'
import { routerRedux } from 'dva/router'
import { queryArticle, createArticle, updateArticle } from 'services/content/article'
import { queryAllCatalog } from 'services/content/catalog'

export default {

  namespace: 'articleEditor',

  state: {
    article: { content: '', catalog: [] },
    catalogs: [],
    actionType: 'create',
  },

  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen((location) => {
        const match = pathToRegexp('/content/article/edit/:id').exec(location.pathname)
        if (match) {
          dispatch({ type: 'queryArticle', payload: { id: match[1] } })
        } else {
          dispatch({ type: 'resetModel' })
        }
      })
    },
  },

  effects: {
    * resetModel ({
      payload,
    }, { call, put }) {
      const catalogsInfo = yield call(queryAllCatalog, payload)
      const { data } = catalogsInfo

      yield put({
        type: 'resetState',
        payload: {
          ...payload,
          catalogList: data,
        },
      })
    },

    * queryArticle ({
      payload,
    }, { call, put }) {
      const catalogsInfo = yield call(queryAllCatalog, payload)
      const articleData = yield call(queryArticle, payload)
      const { data } = catalogsInfo
      const { success, article } = articleData

      if (success) {
        yield put({
          type: 'updateState',
          payload: {
            article,
            catalogList: data,
          },
        })
      } else {
        throw articleData
      }
    },

    * createArticle ({ payload }, { call, put }) {
      const data = yield call(createArticle, payload)
      if (data.success) {
        yield put(routerRedux.push('/content/article'))
      } else {
        throw data
      }
    },

    * updateArticle ({ payload }, { call, put }) {
      const data = yield call(updateArticle, payload)
      if (data.success) {
        yield put(routerRedux.push('/content/article'))
      } else {
        throw data
      }
    },
  },

  reducers: {
    resetState (state, { payload }) {
      const { catalogList } = payload
      const article = { id: -1, title: '', content: '', catalog: [] }
      const catalogs = []
      if (catalogList) {
        for (let item of catalogList) {
          catalogs.unshift({ value: item.id, label: item.name })
        }
      }

      return {
        ...state,
        ...payload,
        article,
        catalogs,
        actionType: 'create',
      }
    },

    updateState (state, { payload }) {
      const { article, catalogList } = payload
      let catalogs = []
      const { catalog } = article

      let catalogIDs = []
      if (catalog) {
        for (let val of catalog) {
          catalogIDs.push(val.id)
        }
      }

      if (catalogList) {
        for (let item of catalogList) {
          catalogs.unshift({ value: item.id, label: item.name })
        }
      }

      return {
        ...state,
        article: { ...article, catalog: catalogIDs },
        catalogs,
        actionType: 'update',
      }
    },

    updateEditorContent (state, { payload }) {
      return {
        ...state,
        ...payload,
      }
    },

    updateEditorState (state, { payload }) {
      return {
        ...state,
        ...payload,
      }
    },

  },
}

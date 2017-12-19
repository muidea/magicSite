import pathToRegexp from 'path-to-regexp'
import { routerRedux } from 'dva/router'
import { queryArticle, createArticle, updateArticle } from 'services/content/article'

import { EditorState, convertFromRaw } from 'draft-js'

export default {

  namespace: 'articleEditor',

  state: {
    id: -1,
    article: { catalog: [] },
    catalogs: [],
    editorState: EditorState.createEmpty(),
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
    }, { put }) {
      yield put({
        type: 'resetState',
        payload: {
          ...payload,
        },
      })
    },

    * queryArticle ({
      payload,
    }, { call, put }) {
      const data = yield call(queryArticle, payload)
      const { success, message, status, article, catalogList } = data
      if (success) {
        yield put({
          type: 'updateState',
          payload: {
            article,
            catalogList,
          },
        })
      } else {
        throw data
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
      const id = -1
      const article = { catalog: [] }
      const catalogs = []
      const editorState = EditorState.createEmpty()
      return {
        ...state,
        ...payload,
        id,
        article,
        catalogs,
        editorState,
        actionType: 'create',
      }
    },

    updateState (state, { payload }) {
      const { article, catalogList } = payload
      let catalogArray = []
      const { id, catalog } = article
      const contentState = convertFromRaw(JSON.parse(article.content))
      const editorState = EditorState.createWithContent(contentState)

      let catalogIDs = []
      if (catalog) {
        for (let val of catalog) {
          catalogIDs.push(val.id)
        }
      }

      if (catalogList) {
        for (let item of catalogList) {
          catalogArray.unshift({ value: item.id, label: item.name })
        }
      }
      return {
        ...state,
        id,
        article: { ...article, catalog: catalogIDs },
        catalogs: catalogArray,
        editorState,
        actionType: 'update',
      }
    },

    updateEditorState (state, { payload }) {
      const { editorState } = payload
      return {
        ...state,
        editorState,
      }
    },
  },
}

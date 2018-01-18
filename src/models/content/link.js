import modelExtend from 'dva-model-extend'
import { routerRedux } from 'dva/router'
import { queryAllLink, queryLink, createLink, updateLink, deleteLink, multiDeleteLink } from 'services/content/link'
import queryString from 'query-string'
import { pageModel } from '../common'

export default modelExtend(pageModel, {
  namespace: 'link',

  state: {
    currentItem: { id: -1, name: '', url: '', logo: '', catalog: [] },
    selectedRowKeys: [],
    modalVisible: false,
    modalType: 'create',
  },

  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen((location) => {
        if (location.pathname === '/content/link') {
          dispatch({
            type: 'queryAllLink',
            payload: queryString.parse(location.search),
          })
        }
      })
    },
  },

  effects: {

    * queryAllLink ({ payload = {} }, { call, put }) {
      const data = yield call(queryAllLink, payload)
      if (data) {
        yield put({
          type: 'queryAllSuccess',
          payload: {
            list: data.data,
            pagination: {
              current: Number(payload.page) || 1,
              pageSize: Number(payload.pageSize) || 10,
              total: data.total,
            },
          },
        })
      }
    },

    * queryLink ({ payload }, { call, put, select }) {
      const data = yield call(queryLink, { id: payload })
      const { selectedRowKeys } = yield select(_ => _.link)
      if (data.success) {
        yield put({ type: 'updateModelState', payload: { selectedRowKeys: selectedRowKeys.filter(_ => _ !== payload) } })
        yield put({ type: 'queryAllLink' })
      } else {
        throw data
      }
    },

    * createLink ({ payload }, { call, put }) {
      const data = yield call(createLink, payload)
      if (data.success) {
        yield put({ type: 'hideModal' })
        yield put(routerRedux.push('/content/link'))
      } else {
        throw data
      }
    },

    * updateLink ({ payload }, { call, put }) {
      const data = yield call(updateLink, payload)
      if (data.success) {
        yield put({ type: 'hideModal' })
        yield put(routerRedux.push('/content/link'))
      } else {
        throw data
      }
    },

    * deleteLink ({ payload }, { call, put, select }) {
      const data = yield call(deleteLink, { id: payload })
      const { selectedRowKeys } = yield select(_ => _.link)
      if (data.success) {
        yield put({ type: 'updateModelState', payload: { selectedRowKeys: selectedRowKeys.filter(_ => _ !== payload) } })
        yield put({ type: 'queryAllLink' })
      } else {
        throw data
      }
    },

    * multiDeleteLink ({ payload }, { call, put }) {
      const data = yield call(multiDeleteLink, payload)
      if (data.success) {
        yield put({ type: 'updateModelState', payload: { selectedRowKeys: [] } })
        yield put({ type: 'queryAllLink' })
      } else {
        throw data
      }
    },
  },

  reducers: {
    showModal (state, { payload }) {
      return { ...state, ...payload, modalVisible: true }
    },

    hideModal (state) {
      return { ...state, currentItem: { id: -1, name: '', url: '', logo: '', catalog: [] }, modalVisible: false }
    },
  },

})

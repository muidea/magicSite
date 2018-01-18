import modelExtend from 'dva-model-extend'
import { routerRedux } from 'dva/router'
import { queryAllMedia, queryMedia, createMedia, updateMedia, deleteMedia, multiDeleteMedia } from 'services/content/media'
import queryString from 'query-string'
import { pageModel } from '../common'

export default modelExtend(pageModel, {
  namespace: 'media',

  state: {
    currentItem: { id: -1, name: '', url: '', descrption: '', catalog: [] },
    selectedRowKeys: [],
    modalVisible: false,
    modalType: 'create',
  },

  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen((location) => {
        if (location.pathname === '/content/media') {
          dispatch({
            type: 'queryAllMedia',
            payload: queryString.parse(location.search),
          })
        }
      })
    },
  },

  effects: {

    * queryAllMedia ({ payload = {} }, { call, put }) {
      const data = yield call(queryAllMedia, payload)
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

    * queryMedia ({ payload }, { call, put, select }) {
      const data = yield call(queryMedia, { id: payload })
      const { selectedRowKeys } = yield select(_ => _.media)
      if (data.success) {
        yield put({ type: 'updateModelState', payload: { selectedRowKeys: selectedRowKeys.filter(_ => _ !== payload) } })
        yield put({ type: 'queryAllMedia' })
      } else {
        throw data
      }
    },

    * createMedia ({ payload }, { call, put }) {
      const data = yield call(createMedia, payload)
      if (data.success) {
        yield put({ type: 'hideModal' })
        yield put(routerRedux.push('/content/media'))
      } else {
        throw data
      }
    },

    * updateMedia ({ payload }, { call, put }) {
      const data = yield call(updateMedia, payload)
      if (data.success) {
        yield put({ type: 'hideModal' })
        yield put(routerRedux.push('/content/media'))
      } else {
        throw data
      }
    },

    * deleteMedia ({ payload }, { call, put, select }) {
      const data = yield call(deleteMedia, { id: payload })
      const { selectedRowKeys } = yield select(_ => _.media)
      if (data.success) {
        yield put({ type: 'updateModelState', payload: { selectedRowKeys: selectedRowKeys.filter(_ => _ !== payload) } })
        yield put({ type: 'queryAllMedia' })
      } else {
        throw data
      }
    },

    * multiDeleteMedia ({ payload }, { call, put }) {
      const data = yield call(multiDeleteMedia, payload)
      if (data.success) {
        yield put({ type: 'updateModelState', payload: { selectedRowKeys: [] } })
        yield put({ type: 'queryAllMedia' })
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
      return { ...state, currentItem: { id: -1, name: '', url: '', descrption: '', catalog: [] }, modalVisible: false }
    },
  },

})

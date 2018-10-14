import modelExtend from 'dva-model-extend'
import { routerRedux } from 'dva/router'
import qs from 'qs'
import { queryAllLink, queryLink, createLink, updateLink, deleteLink, multiDeleteLink } from 'services/content/link'
import { pageModel } from '../common'

export default modelExtend(pageModel, {
  namespace: 'link',

  state: {
    currentItem: { id: -1, name: '', description: '', url: '', logo: '', catalog: [] },
    selectedRowKeys: [],
    modalVisible: false,
    modalType: 'create',
  },

  subscriptions: {
    setup({ dispatch, history }) {
      history.listen((location) => {
        if (location.pathname === '/content/link') {
          const query = qs.parse(location.search, { ignoreQueryPrefix: true })
          dispatch({
            type: 'queryAllLink',
            payload: { ...query },
          })
        }
      })
    },
  },

  effects: {

    * queryAllLink({ payload }, { call, put, select }) {
      const { authToken } = yield select(_ => _.app)
      const data = yield call(queryAllLink, { ...payload, authToken })
      if (data) {
        const { total, link } = data

        yield put({
          type: 'queryAllSuccess',
          payload: {
            list: link,
            pagination: {
              current: Number(payload.pageNum) || 1,
              pageSize: Number(payload.pageSize) || 10,
              total: Number(total) || 0,
            },
          },
        })
      }
    },

    * queryLink({ payload }, { call, put, select }) {
      const { authToken } = yield select(_ => _.app)
      const result = yield call(queryLink, { id: payload, authToken })
      const { selectedRowKeys } = yield select(_ => _.link)
      if (result.success) {
        yield put({ type: 'updateModelState', payload: { selectedRowKeys: selectedRowKeys.filter(_ => _ !== payload) } })
        yield put({ type: 'queryAllLink', payload: {} })
      } else {
        throw result
      }
    },

    * updateLink({ payload }, { call, put, select }) {
      const { authToken } = yield select(_ => _.app)
      const result = yield call(queryLink, { id: payload, authToken })
      if (result.success) {
        const { link } = result
        yield put({ type: 'showModal', payload: { modalType: 'update', currentItem: link } })
      } else {
        throw result
      }
    },

    * saveLink({ payload }, { call, put, select }) {
      const { authToken } = yield select(_ => _.app)
      const { action, data } = payload
      const result = yield call(action === 'create' ? createLink : updateLink, { authToken, ...data })
      if (result.success) {
        yield put({ type: 'hideModal' })
        yield put(routerRedux.push('/content/link'))
      } else {
        throw data
      }
    },

    * deleteLink({ payload }, { call, put, select }) {
      const { authToken } = yield select(_ => _.app)
      const data = yield call(deleteLink, { id: payload, authToken })
      const { selectedRowKeys } = yield select(_ => _.link)
      if (data.success) {
        yield put({ type: 'updateModelState', payload: { selectedRowKeys: selectedRowKeys.filter(_ => _ !== payload) } })
        yield put({ type: 'queryAllLink', payload: {} })
      } else {
        throw data
      }
    },

    * multiDeleteLink({ payload }, { call, put }) {
      const data = yield call(multiDeleteLink, payload)
      if (data.success) {
        yield put({ type: 'updateModelState', payload: { selectedRowKeys: [] } })
        yield put({ type: 'queryAllLink', payload: {} })
      } else {
        throw data
      }
    },
  },

  reducers: {
    showModal(state, { payload }) {
      return { ...state, ...payload, modalVisible: true }
    },

    hideModal(state) {
      return { ...state, currentItem: { id: -1, name: '', description: '', url: '', logo: '', catalog: [] }, modalVisible: false }
    },
  },

})

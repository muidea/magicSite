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

    * queryAllLink ({ payload = {} }, { call, put, select }) {
      const { authToken } = yield select(_ => _.app)
      const data = yield call(queryAllLink, { authToken })
      if (data) {
        const { link } = data
        let totalCount = 0
        if (link) {
          totalCount = link.length
        }

        yield put({
          type: 'queryAllSuccess',
          payload: {
            list: link,
            pagination: {
              current: Number(payload.page) || 1,
              pageSize: Number(payload.pageSize) || 10,
              total: Number(totalCount) || 0,
            },
          },
        })
      }
    },

    * queryLink ({ payload }, { call, put, select }) {
      const { authToken } = yield select(_ => _.app)
      const result = yield call(queryLink, { id: payload, authToken })
      const { selectedRowKeys } = yield select(_ => _.link)
      if (result.success) {
        yield put({ type: 'updateModelState', payload: { selectedRowKeys: selectedRowKeys.filter(_ => _ !== payload) } })
        yield put({ type: 'queryAllLink' })
      } else {
        throw result
      }
    },

    * updateLink ({ payload }, { call, put, select }) {
      const { authToken } = yield select(_ => _.app)
      const result = yield call(queryLink, { id: payload, authToken })
      if (result.success) {
        const { link } = result
        yield put({ type: 'showModal', payload: { modalType: 'update', currentItem: link } })
      } else {
        throw result
      }
    },

    * saveLink ({ payload }, { call, put, select }) {
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

    * deleteLink ({ payload }, { call, put, select }) {
      const { authToken } = yield select(_ => _.app)
      const data = yield call(deleteLink, { id: payload, authToken })
      const { selectedRowKeys } = yield select(_ => _.link)
      if (data.success) {
        yield put({ type: 'updateModelState', payload: { selectedRowKeys: selectedRowKeys.filter(_ => _ !== payload) } })
        yield put({ type: 'queryAllLink' })
      } else {
        throw data
      }
    },

    * multiDeleteLink ({ payload }, { call, put }) {
      const data = yield call(multiDeleteLink, payload)
      if (data.success) {
        yield put({ type: 'updateModelState', payload: { selectedRowKeys: [] } })
        yield put({ type: 'queryAllLink' })
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

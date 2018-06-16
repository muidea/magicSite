import modelExtend from 'dva-model-extend'
import { routerRedux } from 'dva/router'
import qs from 'qs'
import { queryAllMedia, queryMedia, createMedia, deleteMedia, multiDeleteMedia } from 'services/content/media'
import { pageModel } from '../common'

export default modelExtend(pageModel, {
  namespace: 'media',

  state: {
    currentItem: { id: -1, name: '', url: '', descrption: '', expiration: -1, catalog: [] },
    selectedRowKeys: [],
    modalVisible: false,
  },

  subscriptions: {
    setup({ dispatch, history }) {
      history.listen((location) => {
        if (location.pathname === '/content/media') {
          const query = qs.parse(location.search, { ignoreQueryPrefix: true })
          dispatch({
            type: 'queryAllMedia',
            payload: { ...query },
          })
        }
      })
    },
  },

  effects: {

    * queryAllMedia({ payload }, { call, put, select }) {
      const { authToken } = yield select(_ => _.app)
      const data = yield call(queryAllMedia, { ...payload, authToken })
      if (data) {
        const { media } = data
        let totalCount = 0
        if (media) {
          totalCount = media.length
        }

        yield put({
          type: 'queryAllSuccess',
          payload: {
            list: media,
            pagination: {
              current: Number(payload.page) || 1,
              pageSize: Number(payload.pageSize) || 10,
              total: Number(totalCount) || 0,
            },
          },
        })
      }
    },

    * queryMedia({ payload }, { call, put, select }) {
      const { authToken } = yield select(_ => _.app)
      const result = yield call(queryMedia, { id: payload, authToken })
      const { selectedRowKeys } = yield select(_ => _.media)
      if (result.success) {
        yield put({ type: 'updateModelState', payload: { selectedRowKeys: selectedRowKeys.filter(_ => _ !== payload) } })
        yield put({ type: 'queryAllMedia' })
      } else {
        throw result
      }
    },


    * saveMedia({ payload }, { call, put, select }) {
      const { authToken } = yield select(_ => _.app)
      const { data } = payload
      const result = yield call(createMedia, { authToken, ...data })
      if (result.success) {
        yield put({ type: 'hideModal' })
        yield put(routerRedux.push('/content/media'))
      } else {
        throw data
      }
    },

    * deleteMedia({ payload }, { call, put, select }) {
      const { authToken } = yield select(_ => _.app)
      const data = yield call(deleteMedia, { id: payload, authToken })
      const { selectedRowKeys } = yield select(_ => _.media)
      if (data.success) {
        yield put({ type: 'updateModelState', payload: { selectedRowKeys: selectedRowKeys.filter(_ => _ !== payload) } })
        yield put({ type: 'queryAllMedia' })
      } else {
        throw data
      }
    },

    * multiDeleteMedia({ payload }, { call, put, select }) {
      const { authToken } = yield select(_ => _.app)
      const data = yield call(multiDeleteMedia, { authToken, ...payload })
      if (data.success) {
        yield put({ type: 'updateModelState', payload: { selectedRowKeys: [] } })
        yield put({ type: 'queryAllMedia' })
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
      return { ...state, currentItem: { id: -1, name: '', url: '', descrption: '', expiration: -1, catalog: [] }, modalVisible: false }
    },
  },

})

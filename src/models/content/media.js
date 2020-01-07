import modelExtend from 'dva-model-extend'
import qs from 'qs'
import { notification } from 'antd'
import { queryAllMedia, queryMedia, createMedia, updateMedia, deleteMedia } from 'services/content/media'
import { commonModel } from './common'

export default modelExtend(commonModel, {
  namespace: 'media',

  state: {
    currentItem: {},
    selectedRowKeys: [],
    modalVisible: false,
    modalType: 'create',
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
      const { sessionInfo } = yield select(_ => _.app)
      let { pagination } = yield select(_ => _.media)
      const { pageNum } = payload
      if (pageNum) {
        pagination = { ...pagination, current: pageNum }

        payload = { ...payload, pageNum, pageSize: pagination.pageSize }
      }

      const result = yield call(queryAllMedia, { ...payload, ...sessionInfo })
      const { success, message, data } = result
      if (success) {
        const { errorCode, reason, total, medias } = data
        if (errorCode === 0) {
          yield put({
            type: 'queryAllSuccess',
            payload: {
              list: medias,
              pagination: {
                ...pagination,
                total: Number(total) || 0,
              },
            },
          })
        } else {
          notification.error({ message: '错误信息', description: reason })
        }
      } else {
        notification.error({ message: '错误信息', description: message })
      }
    },

    * queryMedia({ payload }, { call, put, select }) {
      const { sessionInfo } = yield select(_ => _.app)
      const result = yield call(queryMedia, { id: payload, ...sessionInfo })
      const { success, message, data } = result
      if (success) {
        const { errorCode, reason, media } = data
        if (errorCode === 0) {
          yield put({ type: 'updateItemState', payload: { currentItem: media } })
        } else {
          notification.error({ message: '错误信息', description: reason })
        }
      } else {
        notification.error({ message: '错误信息', description: message })
      }
    },

    * updateMedia({ payload }, { call, put, select }) {
      const { sessionInfo } = yield select(_ => _.app)
      const result = yield call(updateMedia, { ...payload, ...sessionInfo })
      const { success, message, data } = result
      if (success) {
        const { errorCode, reason } = data
        if (errorCode === 0) {
          yield put({ type: 'queryAllMedia' })
        } else {
          notification.error({ message: '错误信息', description: reason })
        }
      } else {
        notification.error({ message: '错误信息', description: message })
      }
    },

    * saveMedia({ payload }, { call, put, select }) {
      const { sessionInfo } = yield select(_ => _.app)
      const result = yield call(createMedia, { ...payload, ...sessionInfo })
      const { success, message, data } = result
      if (success) {
        const { errorCode, reason } = data
        if (errorCode === 0) {
          yield put({ type: 'queryAllMedia', payload: {} })
        } else {
          notification.error({ message: '错误信息', description: reason })
        }
      } else {
        notification.error({ message: '错误信息', description: message })
      }
    },

    * deleteMedia({ payload }, { call, put, select }) {
      const { sessionInfo } = yield select(_ => _.app)
      const { selectedRowKeys } = yield select(_ => _.media)
      const result = yield call(deleteMedia, { id: payload, ...sessionInfo })
      const { success, message, data } = result
      if (success) {
        const { errorCode, reason } = data
        if (errorCode === 0) {
          yield put({ type: 'updateModelState', payload: { selectedRowKeys: selectedRowKeys.filter(_ => _ !== payload) } })
          yield put({ type: 'queryAllMedia', payload: {} })
        } else {
          notification.error({ message: '错误信息', description: reason })
        }
      } else {
        notification.error({ message: '错误信息', description: message })
      }
    },

    * submitMedia({ payload }, { put, select }) {
      const { modalType } = yield select(_ => _.media)
      if (modalType === 'create') {
        yield put({ type: 'saveMedia', payload })
      } else {
        yield put({ type: 'updateMedia', payload })
      }

      yield put({ type: 'updateItemState', payload: { currentItem: {}, modalVisible: false } })
    },

    * cancelMedia({ payload }, { put, select }) {
      const { modalType } = yield select(_ => _.media)
      if (modalType === 'create') {
        yield put({ type: 'cancelNewMedia', payload })
      } else {
        yield put({ type: 'cancelUpdateMedia', payload })
      }
    },

    * invokeNewMedia({ payload }, { put }) {
      yield put({ type: 'queryCatalogTree', payload: { namespace: 'media' } })
      yield put({ type: 'updateItemState', payload: { currentItem: {}, modalVisible: true, modalType: 'create' } })
    },

    * cancelNewMedia({ payload }, { put }) {
      yield put({ type: 'updateItemState', payload: { currentItem: {}, modalVisible: false, modalType: 'create' } })
    },

    * invokeUpdateMedia({ payload }, { put }) {
      yield put({ type: 'queryMedia', payload })
      yield put({ type: 'queryCatalogTree', payload: { namespace: 'media' } })
      yield put({ type: 'updateItemState', payload: { currentItem: {}, modalVisible: true, modalType: 'update' } })
    },

    * cancelUpdateMedia({ payload }, { put }) {
      yield put({ type: 'updateItemState', payload: { currentItem: {}, modalVisible: false, modalType: 'update' } })
    },
  },

})

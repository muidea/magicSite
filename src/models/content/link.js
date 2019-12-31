import modelExtend from 'dva-model-extend'
import qs from 'qs'
import { notification } from 'antd'
import { queryAllLink, queryLink, createLink, updateLink, deleteLink } from 'services/content/link'
import { pageModel } from '../common'

export default modelExtend(pageModel, {
  namespace: 'link',

  state: {
    currentItem: {},
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
      const { sessionInfo } = yield select(_ => _.app)
      let { pagination } = yield select(_ => _.link)
      const { pageNum } = payload
      if (pageNum) {
        pagination = { ...pagination, current: pageNum }

        payload = { ...payload, pageNum, pageSize: pagination.pageSize }
      }

      const result = yield call(queryAllLink, { ...payload, ...sessionInfo })
      const { success, message, data } = result
      if (success) {
        const { errorCode, reason, total, links } = data
        if (errorCode === 0) {
          yield put({
            type: 'queryAllSuccess',
            payload: {
              list: links,
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

    * queryLink({ payload }, { call, put, select }) {
      const { sessionInfo } = yield select(_ => _.app)
      const result = yield call(queryLink, { id: payload, ...sessionInfo })
      const { success, message, data } = result
      if (success) {
        const { errorCode, reason, link } = data
        if (errorCode === 0) {
          yield put({ type: 'updateItemState', payload: { currentItem: link } })
        } else {
          notification.error({ message: '错误信息', description: reason })
        }
      } else {
        notification.error({ message: '错误信息', description: message })
      }
    },

    * updateLink({ payload }, { call, put, select }) {
      const { sessionInfo } = yield select(_ => _.app)
      const result = yield call(updateLink, { ...payload, ...sessionInfo })
      const { success, message, data } = result
      if (success) {
        const { errorCode, reason } = data
        if (errorCode === 0) {
          yield put({ type: 'queryAllLink' })
        } else {
          notification.error({ message: '错误信息', description: reason })
        }
      } else {
        notification.error({ message: '错误信息', description: message })
      }
    },

    * saveLink({ payload }, { call, put, select }) {
      const { sessionInfo } = yield select(_ => _.app)
      const result = yield call(createLink, { ...payload, ...sessionInfo })
      const { success, message, data } = result
      if (success) {
        const { errorCode, reason } = data
        if (errorCode === 0) {
          yield put({ type: 'queryAllLink' })
        } else {
          notification.error({ message: '错误信息', description: reason })
        }
      } else {
        notification.error({ message: '错误信息', description: message })
      }
    },

    * deleteLink({ payload }, { call, put, select }) {
      const { sessionInfo } = yield select(_ => _.app)
      const { selectedRowKeys } = yield select(_ => _.link)
      const result = yield call(deleteLink, { id: payload, ...sessionInfo })
      const { success, message, data } = result
      if (success) {
        const { errorCode, reason } = data
        if (errorCode === 0) {
          yield put({ type: 'updateModelState', payload: { selectedRowKeys: selectedRowKeys.filter(_ => _ !== payload) } })
          yield put({ type: 'queryAllLink' })
        } else {
          notification.error({ message: '错误信息', description: reason })
        }
      } else {
        notification.error({ message: '错误信息', description: message })
      }
    },

    * submitLink({ payload }, { put, select }) {
      const { modalType } = yield select(_ => _.link)
      if (modalType === 'create') {
        yield put({ type: 'saveLink', payload })
      } else {
        yield put({ type: 'updateLink', payload })
      }

      yield put({ type: 'updateItemState', payload: { currentItem: {}, modalVisible: false } })
    },

    * cancelLink({ payload }, { put, select }) {
      const { modalType } = yield select(_ => _.link)
      if (modalType === 'create') {
        yield put({ type: 'cancelNewLink', payload })
      } else {
        yield put({ type: 'cancelUpdateLink', payload })
      }
    },

    * invokeNewLink({ payload }, { put }) {
      yield put({ type: 'updateItemState', payload: { currentItem: {}, modalVisible: true, modalType: 'create' } })
    },

    * cancelNewLink({ payload }, { put }) {
      yield put({ type: 'updateItemState', payload: { currentItem: {}, modalVisible: false, modalType: 'create' } })
    },

    * invokeUpdateLink({ payload }, { put }) {
      yield put({ type: 'queryLink', payload })
      yield put({ type: 'updateItemState', payload: { currentItem: {}, modalVisible: true, modalType: 'update' } })
    },

    * cancelUpdateLink({ payload }, { put }) {
      yield put({ type: 'updateItemState', payload: { currentItem: {}, modalVisible: false, modalType: 'update' } })
    },
  },

  reducers: {
    updateItemState(state, { payload }) {
      return { ...state, ...payload }
    },
  },

})

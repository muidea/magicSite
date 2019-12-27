import modelExtend from 'dva-model-extend'
import { notification } from 'antd'
import { enumInitPrivate, queryAllPrivate, savePrivate, destoryPrivate } from 'services/authority/private'

import { pageModel } from '../common'

export default modelExtend(pageModel, {
  namespace: 'privateGroup',

  state: {
    initPrivateList: [],
    privateGroupList: [],
    currentPrivateGroup: {},
    showPrivateGroupWizard: false,
  },

  subscriptions: {
    setup({ dispatch, history }) {
      history.listen((location) => {
        if (location.pathname === '/authority/private') {
          dispatch({
            type: 'queryAllPrivate',
            payload: {},
          })
        }
      })
    },
  },

  effects: {
    *enumInitPrivate({ payload }, { call, put, select }) {
      const { sessionInfo } = yield select(_ => _.app)
      const result = yield call(enumInitPrivate, { ...payload, ...sessionInfo })
      const { success, data } = result
      if (success) {
        const { errorCode, privates } = data
        if (errorCode === 0) {
          yield put({
            type: 'save',
            payload: {
              initPrivateList: privates,
            } })
        } else {
          yield put({
            type: 'save',
            payload: {
              initPrivateList: [],
            },
          })
        }
      } else {
        yield put({
          type: 'save',
          payload: {
            initPrivateList: [],
          },
        })
      }
    },

    *queryAllPrivate({ payload }, { call, put, select }) {
      const { sessionInfo } = yield select(_ => _.app)
      const result = yield call(queryAllPrivate, { ...payload, ...sessionInfo })
      const { success, data } = result
      if (success) {
        const { errorCode, privates } = data
        if (errorCode === 0) {
          yield put({
            type: 'save',
            payload: {
              privateGroupList: privates,
            } })
        } else {
          yield put({
            type: 'save',
            payload: {
              privateGroupList: [],
            },
          })
        }
      } else {
        yield put({
          type: 'save',
          payload: {
            privateGroupList: [],
          },
        })
      }
    },

    *selectPrivate({ payload }, { put }) {
      yield put({
        type: 'save',
        payload: {
          currentPrivateGroup: { ...payload },
        },
      })
    },

    *invokeNewPrivate({ payload }, { put }) {
      yield put({
        type: 'enumInitPrivate',
      })

      yield put({
        type: 'save',
        payload: {
          showPrivateGroupWizard: true,
        },
      })
    },

    *cancelNewPrivate({ payload }, { put }) {
      yield put({
        type: 'save',
        payload: {
          showPrivateGroupWizard: false,
        },
      })
    },

    *savePrivate({ payload }, { call, put, select }) {
      const { sessionInfo } = yield select(_ => _.app)
      const result = yield call(savePrivate, { ...payload, ...sessionInfo })
      const { success, message, data } = result
      if (success) {
        const { errorCode, reason } = data
        if (errorCode !== 0) {
          notification.error({ message: '保存权限组失败', description: reason })
        } else {
          yield put({
            type: 'queryPrivate',
          })

          yield put({
            type: 'save',
            payload: {
              showPrivateGroupWizard: false,
              currentPrivateGroup: {},
            },
          })
        }
      } else {
        notification.error({ message: '保存权限组失败', description: message })
      }
    },

    *destoryPrivate({ payload }, { call, put, select }) {
      const { sessionInfo } = yield select(_ => _.app)
      const result = yield call(destoryPrivate, { ...payload, ...sessionInfo })
      const { success, message, data } = result
      if (success) {
        const { errorCode, reason } = data
        if (errorCode !== 0) {
          notification.error({ message: '删除权限组失败', description: reason })
        } else {
          yield put({
            type: 'queryPrivate',
          })
        }
      } else {
        notification.error({ message: '删除权限组失败', description: message })
      }
    },
  },

  reducers: {
    save(state, action) {
      return { ...state, ...action.payload }
    },
  },
})

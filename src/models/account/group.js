import modelExtend from 'dva-model-extend'
import { queryAllGroup, deleteGroup, multiDeleteGroup } from 'services/account/group'
import queryString from 'query-string'
import { pageModel } from '../common'

export default modelExtend(pageModel, {
  namespace: 'group',

  state: {
    currentItem: {},
    selectedRowKeys: [],
  },

  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen((location) => {
        if (location.pathname === '/account/group') {
          dispatch({
            type: 'queryAllGroup',
            payload: queryString.parse(location.search),
          })
        }
      })
    },
  },

  effects: {

    * queryAllGroup ({ payload = {} }, { call, put }) {
      const data = yield call(queryAllGroup, payload)
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

    * deleteGroup ({ payload }, { call, put, select }) {
      const data = yield call(deleteGroup, { id: payload })
      const { selectedRowKeys } = yield select(_ => _.group)
      if (data.success) {
        yield put({ type: 'updateModelState', payload: { selectedRowKeys: selectedRowKeys.filter(_ => _ !== payload) } })
        yield put({ type: 'queryAllGroup' })
      } else {
        throw data
      }
    },

    * multiDeleteGroup ({ payload }, { call, put }) {
      const data = yield call(multiDeleteGroup, payload)
      if (data.success) {
        yield put({ type: 'updateModelState', payload: { selectedRowKeys: [] } })
        yield put({ type: 'queryAllGroup' })
      } else {
        throw data
      }
    },
  },

  reducers: {
  },
})

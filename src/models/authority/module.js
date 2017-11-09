/* global window */
import modelExtend from 'dva-model-extend'
import { config } from 'utils'
import { create, remove, update } from 'services/authority/module'
import queryString from 'query-string'
import { pageModel } from '../common'

const { prefix } = config

export default modelExtend(pageModel, {
  namespace: 'module',

  state: {
    currentItem: {},
  },

  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen((location) => {
        if (location.pathname === '/authority/module') {
        }
      })
    },
  },

  effects: {

    * query ({ payload = {} }, { call, put }) {
    },

    * delete ({ payload }, { call, put, select }) {
    },

    * create ({ payload }, { call, put }) {
    },

    * update ({ payload }, { select, call, put }) {
    },

  },

  reducers: {
  },
})

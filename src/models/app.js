/* global window */
/* global document */
/* global location */
import { routerRedux } from 'dva/router'
import qs from 'qs'
import { notification } from 'antd'
import config from 'config'
import { userStatus, userLogin, userLogout } from 'services/app'

const { prefix } = config


export default {
  namespace: 'app',
  state: {
    sessionInfo: qs.parse(window.localStorage.getItem(`${prefix}SessionInfo`)),
    onlineUser: { },
    menu: [
      {
        id: 1,
        icon: 'laptop',
        name: 'Dashboard',
        router: '/dashboard',
      },
    ],
    menuPopoverVisible: false,
    siderFold: window.localStorage.getItem(`${prefix}siderFold`) === 'true',
    darkTheme: window.localStorage.getItem(`${prefix}darkTheme`) === 'true',
    isNavbar: document.body.clientWidth < 769,
    navOpenKeys: JSON.parse(window.localStorage.getItem(`${prefix}navOpenKeys`)) || [],
    locationPathname: '',
    locationQuery: {},
  },

  subscriptions: {
    setupHistory({ dispatch, history }) {
      history.listen((location) => {
        dispatch({
          type: 'status',
          payload: {
            locationPathname: location.pathname,
            locationQuery: qs.parse(location.search),
          },
        })
      })
    },
  },

  effects: {
    * status({ payload }, { call, put, select }) {
      const { sessionInfo } = yield select(_ => _.app)
      if (sessionInfo) {
        payload = { ...payload, ...sessionInfo }
      }

      const { locationPathname } = payload
      const result = yield call(userStatus, { ...payload })
      const { success, data } = result
      if (success) {
        const { errorCode, reason } = data
        if (errorCode === 0) {
          yield put({
            type: 'saveSession',
            payload: {
              sessionInfo: data.sessionInfo,
              onlineUser: data.account,
            },
          })
        } else {
          notification.error({ message: '错误信息', description: reason })
        }
      } else if (config.openPages && config.openPages.indexOf(locationPathname) < 0) {
        yield put(routerRedux.push({
          pathname: '/login',
          search: qs.stringify({ from: locationPathname }),
        }))
      }
    },

    *login({ payload }, { call, put }) {
      const result = yield call(userLogin, { ...payload })
      const { success, message, data } = result
      if (success) {
        const { errorCode, reason, sessionInfo, account } = data
        if (errorCode === 0) {
          yield put({ type: 'saveSession', payload: { isLogin: true, sessionInfo, onlineUser: account } })
          yield put(routerRedux.push({
            pathname: '/index',
          }))
        } else {
          notification.error({ message: '登陆失败', description: reason })
        }
      } else {
        notification.error({ message: '登陆失败', description: message })
      }
    },

    * logout({ payload }, { call, put, select }) {
      const { sessionInfo } = yield select(_ => _.app)
      payload = { ...payload, ...sessionInfo }

      const result = yield call(userLogout, { ...payload })
      const { success, message, data } = result
      if (success) {
        const { errorCode } = data
        if (errorCode === 0) {
          yield put({ type: 'clearSession', payload: { isLogin: false, sessionInfo: null, onlineUser: null } })
          yield put(routerRedux.push({
            pathname: '/login',
          }))
        }
      } else {
        notification.error({ message: '注销失败', description: message })
      }
    },

    * changeNavbar(action, { put, select }) {
      const { app } = yield (select(_ => _))
      const isNavbar = document.body.clientWidth < 769
      if (isNavbar !== app.isNavbar) {
        yield put({ type: 'handleNavbar', payload: isNavbar })
      }
    },

  },

  reducers: {
    saveSession(state, { payload }) {
      const { sessionInfo } = payload

      if (sessionInfo) {
        window.localStorage.setItem(`${prefix}SessionInfo`, qs.stringify(sessionInfo))
      }

      return { ...state, ...payload }
    },

    clearSession(state, { payload }) {
      window.localStorage.removeItem(`${prefix}SessionInfo`)

      return { ...state, ...payload }
    },

    switchSider(state) {
      window.localStorage.setItem(`${prefix}siderFold`, !state.siderFold)
      return {
        ...state,
        siderFold: !state.siderFold,
      }
    },

    switchTheme(state) {
      window.localStorage.setItem(`${prefix}darkTheme`, !state.darkTheme)
      return {
        ...state,
        darkTheme: !state.darkTheme,
      }
    },

    switchMenuPopver(state) {
      return {
        ...state,
        menuPopoverVisible: !state.menuPopoverVisible,
      }
    },

    handleNavbar(state, { payload }) {
      return {
        ...state,
        isNavbar: payload,
      }
    },

    handleNavOpenKeys(state, { payload: navOpenKeys }) {
      return {
        ...state,
        ...navOpenKeys,
      }
    },
  },
}

/* global window */
/* global document */
/* global location */
import { routerRedux } from 'dva/router'
import qs from 'qs'
import { notification } from 'antd'
import config from 'config'
import { systemInfo, userStatus, userLogin, userLogout } from 'services/app'

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
    siderFold: window.localStorage.getItem(`${prefix}SiderFold`) === 'true',
    darkTheme: window.localStorage.getItem(`${prefix}DarkTheme`) === 'true',
    isNavbar: document.body.clientWidth < 769,
    navOpenKeys: JSON.parse(window.localStorage.getItem(`${prefix}navOpenKeys`)) || [],
    locationPathname: '',
    locationQuery: {},
  },

  subscriptions: {
    setup({ dispatch, history }) {
      history.listen((location) => {
        dispatch({
          type: 'loading',
          payload: {
            locationPathname: location.pathname,
            locationQuery: qs.parse(location.search),
          },
        })
      })
    },
  },

  effects: {
    * loading({ payload }, { call, put, select }) {
      const { locationPathname } = payload
      const { sessionInfo } = yield select(_ => _.app)
      const { sessionID } = sessionInfo

      if (locationPathname !== '/login') {
        if (sessionID) {
          const result = yield call(systemInfo, { ...payload })
          const { success, message, data } = result
          if (success) {
            const { menu } = data

            yield put({
              type: 'saveSession',
              payload: {
                menu,
              },
            })
          } else {
            notification.error({ message: '错误信息', description: message })
            return
          }

          yield put({
            type: 'status',
            payload,
          })
        } else {
          yield put(routerRedux.push({
            pathname: '/login',
            search: qs.stringify({ from: locationPathname }),
          }))
        }
      } else if (sessionID) {
        yield put(routerRedux.push({
          pathname: '/',
          search: qs.stringify({ from: locationPathname }),
        }))
      }
    },

    * status({ payload }, { call, put, select }) {
      const { sessionInfo } = yield select(_ => _.app)
      if (sessionInfo) {
        payload = { ...payload, ...sessionInfo }
      }

      const { locationPathname, locationQuery } = payload
      const result = yield call(userStatus, { ...payload })
      const { success, message, data } = result
      if (success) {
        const { errorCode, reason } = data
        if (errorCode === 0) {
          yield put({
            type: 'saveSession',
            payload: {
              sessionInfo: data.sessionInfo,
              onlineUser: data.account,
              locationPathname,
              locationQuery,
            },
          })
        } else {
          yield put({
            type: 'saveSession',
            payload: {
              sessionInfo: {},
              onlineUser: {},
              locationPathname,
              locationQuery,
            },
          })

          notification.error({ message: '错误信息', description: reason })
        }
      } else {
        notification.error({ message: '错误信息', description: message })
      }
    },

    *login({ payload }, { call, put }) {
      const result = yield call(userLogin, { ...payload })
      const { success, message, data } = result
      if (success) {
        const { errorCode, reason, sessionInfo, account } = data
        if (errorCode === 0) {
          yield put({ type: 'saveSession', payload: { sessionInfo, onlineUser: account } })
          yield put(routerRedux.push({
            pathname: '/',
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
          yield put({ type: 'clearSession', payload: { sessionInfo: {}, onlineUser: {} } })
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
      window.localStorage.setItem(`${prefix}SiderFold`, !state.siderFold)
      return {
        ...state,
        siderFold: !state.siderFold,
      }
    },

    switchTheme(state) {
      window.localStorage.setItem(`${prefix}DarkTheme`, !state.darkTheme)
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

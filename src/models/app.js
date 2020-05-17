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
    menu: [],
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
            locationQuery: qs.parse(location.search, { ignoreQueryPrefix: true }),
          },
        })
      })
    },
  },

  effects: {
    * loading({ payload }, { call, put, select }) {
      const { locationPathname } = payload
      const { menu } = yield select(_ => _.app)

      if (locationPathname !== '/login') {
        if (menu.length === 0) {
          const result = yield call(systemInfo, { ...payload })
          const { success, message, data } = result
          if (success) {
            yield put({
              type: 'saveSession',
              payload: {
                menu: data.menu,
              },
            })
          } else {
            notification.error({ message: '错误信息', description: message })
            return
          }
        }
      }

      yield put({
        type: 'status',
        payload,
      })
    },

    * status({ payload }, { call, put, select }) {
      const { locationPathname, locationQuery } = payload
      const { sessionInfo } = yield select(_ => _.app)

      const result = yield call(userStatus, { ...sessionInfo })
      const { success, message, data } = result
      if (success) {
        const { from } = locationQuery
        let redirectUrl = locationPathname
        if (from) {
          redirectUrl = from
        }

        const { errorCode } = data
        if (errorCode === 0) {
          yield put({
            type: 'saveSession',
            payload: {
              onlineUser: data.entity,
              sessionInfo: data.sessionInfo,
              locationPathname,
              locationQuery,
            },
          })

          if (redirectUrl === '/login') {
            redirectUrl = '/'
          }
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

          if (redirectUrl !== '/login') {
            redirectUrl = '/login'
          }
        }

        if (redirectUrl !== locationPathname) {
          yield put(routerRedux.push({
            pathname: redirectUrl,
            search: qs.stringify({ from: locationPathname, ...sessionInfo }),
          }))
        }
      } else {
        notification.error({ message: '错误信息', description: message })
      }
    },

    *login({ payload }, { call, put, select }) {
      const { locationQuery } = yield select(_ => _.app)
      const result = yield call(userLogin, { ...payload })
      const { success, message, data } = result
      if (success) {
        const { errorCode, reason, sessionInfo, entity } = data
        if (errorCode === 0) {
          let redirectUrl = '/'
          const { from } = locationQuery
          if (from) {
            redirectUrl = from
          }

          yield put({ type: 'saveSession', payload: { sessionInfo, onlineUser: entity } })
          yield put(routerRedux.push({
            pathname: redirectUrl,
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
          yield put({ type: 'clearSession', payload: { sessionInfo: {}, menu: [], onlineUser: {} } })
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

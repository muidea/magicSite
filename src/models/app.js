/* global window */
/* global document */
/* global location */
import { routerRedux } from 'dva/router'
import { parse } from 'qs'
import config from 'config'
import { EnumRoleType } from 'enums'
import { queryStatus, logout } from 'services/app'
import * as menusService from 'services/menus'
import queryString from 'query-string'

const { prefix } = config

export default {
  namespace: 'app',
  state: {
    sessionID: window.localStorage.getItem(`${prefix}SessionID`),
    authToken: window.localStorage.getItem(`${prefix}AuthToken`),
    accountInfo: {},
    permissions: {
      visit: [],
    },
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

    setupHistory ({ dispatch, history }) {
      history.listen((location) => {
        dispatch({
          type: 'updateState',
          payload: {
            locationPathname: location.pathname,
            locationQuery: queryString.parse(location.search),
          },
        })
      })
    },

    setup ({ dispatch }) {
      dispatch({ type: 'query' })
      let tid
      window.onresize = () => {
        clearTimeout(tid)
        tid = setTimeout(() => {
          dispatch({ type: 'changeNavbar' })
        }, 300)
      }
    },

  },
  
  effects: {
    * query ({
      payload,
    }, { call, put, select }) {
      const { sessionID, authToken, locationPathname } = yield select(_ => _.app)
      const { errorCode, accountInfo } = yield call(queryStatus, { sessionID, authToken, ...payload })
      if (errorCode == 0 && accountInfo) {
        const { list } = yield call(menusService.query)
        const { Permissions } = accountInfo
        let menu = list
        if (Permissions.role === EnumRoleType.ADMIN || Permissions.role === EnumRoleType.DEVELOPER) {
          Permissions.visit = list.map(item => item.id)
        } else {
          menu = list.filter((item) => {
            const cases = [
              Permissions.visit.includes(item.id),
              item.mpid ? Permissions.visit.includes(item.mpid) || item.mpid === '-1' : true,
              item.bpid ? Permissions.visit.includes(item.bpid) : true,
            ]
            return cases.every(_ => _)
          })
        }

      let availableMenu = new Array()
      let avalible = false
      menu.forEach((value, index, menu) => {
        if (value.module) {
          if (Permissions.module.some((val)=>{ return val == value.module })) {
            availableMenu.push(value)
            avalible = true  
          } else {
            avalible = false
          }
        } else if (avalible) {
          availableMenu.push(value)
        } else {
        }
      });
      menu = availableMenu

       yield put({
          type: 'updateState',
          payload: {
            accountInfo: accountInfo,
            permissions: Permissions,
            menu,
          },
       })
       if (location.pathname === '/login') {
         yield put(routerRedux.push({
            pathname: '/dashboard',
         }))
       }
      } else if (config.openPages && config.openPages.indexOf(locationPathname) < 0) {
        yield put(routerRedux.push({
          pathname: '/login',
          search: queryString.stringify({
            from: locationPathname,
          }),
        }))
      }
    },

    * logout ({
      payload,
    }, { call, put, select }) {
      const { sessionID, authToken } = yield select(_ => _.app)
      const data = yield call(logout, { sessionID, authToken, ...payload })
      if (data.success) {
        yield put({ type: 'clearStatus' })
        yield put({ type: 'query' })
      } else {
        throw (data)
      }
    },

    * changeNavbar (action, { put, select }) {
      const { app } = yield (select(_ => _))
      const isNavbar = document.body.clientWidth < 769
      if (isNavbar !== app.isNavbar) {
        yield put({ type: 'handleNavbar', payload: isNavbar })
      }
    },

  },

  reducers: {

    updateState (state, { payload }) {
      const {sessionID, authToken} = payload

      if (sessionID && authToken) {
        window.localStorage.setItem(`${prefix}SessionID`, sessionID)
        window.localStorage.setItem(`${prefix}AuthToken`, authToken)  
      }
      
      return {
        ...state,
        ...payload,
      }
    },

    clearStatus(state) {
      window.localStorage.removeItem(`${prefix}SessionID`)
      window.localStorage.removeItem(`${prefix}AuthToken`)
      
      return {
        ...state,
        sessionID: '',
        authToken: '',
        accountInfo: {},
        permissions: {
          visit: [],
        },        
      }
    },

    switchSider (state) {
      window.localStorage.setItem(`${prefix}siderFold`, !state.siderFold)
      return {
        ...state,
        siderFold: !state.siderFold,
      }
    },

    switchTheme (state) {
      window.localStorage.setItem(`${prefix}darkTheme`, !state.darkTheme)
      return {
        ...state,
        darkTheme: !state.darkTheme,
      }
    },

    switchMenuPopver (state) {
      return {
        ...state,
        menuPopoverVisible: !state.menuPopoverVisible,
      }
    },

    handleNavbar (state, { payload }) {
      return {
        ...state,
        isNavbar: payload,
      }
    },

    handleNavOpenKeys (state, { payload: navOpenKeys }) {
      return {
        ...state,
        ...navOpenKeys,
      }
    },
  },
}

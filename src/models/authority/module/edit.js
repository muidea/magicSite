import pathToRegexp from 'path-to-regexp'
import { queryModule, updateModule } from 'services/authority/module'
import { queryAllUser } from 'services/account/user'

export default {

  namespace: 'moduleEdit',

  state: {
    currentStep: 0,
    id: '',
    name: '',
    description: '',
    type: 0,
    status: 0,
    userAuthGroup: [],
    userList: [],
    currentTempUserAuthGroup: {},
  },

  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen((location) => {
        const match = pathToRegexp('/authority/module/edit/:id').exec(location.pathname)
        if (match) {
          dispatch({
            type: 'queryModule',
            payload: { id: match[1] },
          })
        }
      })
    },
  },

  effects: {
    * queryModule ({ payload }, { call, put, select }) {
      const { authToken } = yield select(_ => _.app)
      const result = yield call(queryModule, { authToken, ...payload })
      const { success, message, status, ...other } = result
      if (success) {
        const userResult = yield call(queryAllUser, { authToken })
        const { user } = userResult
        yield put({
          type: 'queryModuleSuccess',
          payload: { data: other, user, currentStep: 0 },
        })
      } else {
        throw result
      }
    },

    * submitUserAuthGroup ({ payload }, { call, put, select }) {
      const { authToken } = yield select(_ => _.app)
      const { id, userAuthGroup } = payload
      let usrAuthGroupList = []
      if (userAuthGroup !== null && userAuthGroup !== undefined) {
        for (let idx = 0; idx < userAuthGroup.length; idx += 1) {
          const item = userAuthGroup[idx]
          const { authGroup } = item
          usrAuthGroupList.push({ user: item.id, authGroup: authGroup.id })
        }
      }

      const result = yield call(updateModule, { authToken, id, userAuthGroup: usrAuthGroupList })
      yield put({
        type: 'submitUserAuthGroupResult',
        payload: { result },
      })
    },
  },

  reducers: {
    moveToStep (state, { payload }) {
      const { currentStep } = payload
      return {
        ...state,
        currentStep,
      }
    },

    updateTempUserAuthGroupInfo (state, { payload }) {
      const { currentTempUserAuthGroup } = payload
      return {
        ...state,
        currentTempUserAuthGroup,
      }
    },

    completeUserAuthGroup (state, { payload }) {
      const { userAuthGroup } = state
      const { currentTempUserAuthGroup, currentStep } = payload
      const { user, authGroup } = currentTempUserAuthGroup

      userAuthGroup.push({ ...user, authGroup })

      return {
        ...state,
        userAuthGroup,
        currentStep,
        currentTempUserAuthGroup: {},
      }
    },

    queryModuleSuccess (state, { payload }) {
      const { data, user, currentStep } = payload
      const { module } = data
      const { userAuthGroup } = module

      return {
        ...state,
        ...module,
        userAuthGroup: userAuthGroup !== null ? userAuthGroup : [],
        userList: user,
        currentStep,
      }
    },

    submitUserAuthGroupResult (state, { payload }) {
      const { result } = payload
      let { currentStep } = state

      currentStep += 1

      console.log(result)

      return { ...state, currentStep }
    },
  },
}

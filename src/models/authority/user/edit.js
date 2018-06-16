import pathToRegexp from 'path-to-regexp'
import { queryUser, updateUser } from 'services/authority/user'
import { queryAllModule } from 'services/module/registry'

export default {

  namespace: 'userEdit',

  state: {
    currentStep: 0,
    id: '',
    account: '',
    email: '',
    name: '',
    group: [],
    registerTime: '',
    status: {},
    moduleAuthGroup: [],
    moduleList: [],
    currentTempModuleAuthGroup: {},
  },

  subscriptions: {
    setup({ dispatch, history }) {
      history.listen((location) => {
        const match = pathToRegexp('/authority/user/edit/:id').exec(location.pathname)
        if (match) {
          dispatch({
            type: 'queryUser',
            payload: { id: match[1] },
          })
        }
      })
    },
  },

  effects: {
    * queryUser({ payload }, { call, put, select }) {
      const { authToken } = yield select(_ => _.app)
      const result = yield call(queryUser, { authToken, ...payload })
      const { success, ...other } = result
      if (success) {
        const moduleResult = yield call(queryAllModule, { authToken })
        const { module } = moduleResult
        yield put({
          type: 'queryUserSuccess',
          payload: { data: other, module, currentStep: 0 },
        })
      } else {
        throw result
      }
    },

    * submitModuleAuthGroup({ payload }, { call, put, select }) {
      const { authToken } = yield select(_ => _.app)
      const { id, moduleAuthGroup } = payload
      const modAuthGroupList = []
      if (moduleAuthGroup !== null && moduleAuthGroup !== undefined) {
        for (let idx = 0; idx < moduleAuthGroup.length; idx += 1) {
          const item = moduleAuthGroup[idx]
          const { authGroup } = item
          modAuthGroupList.push({ module: item.id, authGroup: authGroup.id })
        }
      }

      const result = yield call(updateUser, { authToken, id, moduleAuthGroup: modAuthGroupList })
      yield put({
        type: 'submitModuleAuthGroupResult',
        payload: { result },
      })
    },
  },

  reducers: {
    moveToStep(state, { payload }) {
      const { currentStep } = payload
      return {
        ...state,
        currentStep,
      }
    },

    updateTempModuleAuthGroupInfo(state, { payload }) {
      const { currentTempModuleAuthGroup } = payload
      return {
        ...state,
        currentTempModuleAuthGroup,
      }
    },

    completeModuleAuthGroup(state, { payload }) {
      const { moduleAuthGroup } = state
      const { currentTempModuleAuthGroup, currentStep } = payload
      const { module, authGroup } = currentTempModuleAuthGroup

      let exist = false
      for (let idx = 0; idx < moduleAuthGroup.length; idx += 1) {
        const current = moduleAuthGroup[idx]
        const { id } = current
        if (id === module.id) {
          exist = true
        }
      }

      if (!exist) {
        moduleAuthGroup.push({ ...module, authGroup })
      }

      return {
        ...state,
        moduleAuthGroup,
        currentStep,
        currentTempModuleAuthGroup: {},
      }
    },

    queryUserSuccess(state, { payload }) {
      const { data, module, currentStep } = payload
      const { user } = data
      const { moduleAuthGroup } = user

      return {
        ...state,
        ...user,
        moduleAuthGroup: moduleAuthGroup !== null ? moduleAuthGroup : [],
        moduleList: module,
        currentStep,
        currentTempModuleAuthGroup: {},
      }
    },

    submitModuleAuthGroupResult(state, { payload }) {
      const { result } = payload
      let { currentStep } = state

      currentStep += 1

      console.log(result)

      return { ...state, currentStep }
    },
  },
}

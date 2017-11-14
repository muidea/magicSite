import React from 'react'
import PropTypes from 'prop-types'
import { Switch, Route, Redirect, routerRedux } from 'dva/router'
import dynamic from 'dva/dynamic'
import App from 'routes/app'

const { ConnectedRouter } = routerRedux

const Routers = function ({ history, app }) {
  const error = dynamic({
    app,
    component: () => import('./routes/error'),
  }) 
  const routes = [
    {
      path: '/dashboard',
      models: () => [import('./models/dashboard')],
      component: () => import('./routes/dashboard/'),
    }, {
      path: '/content/article',
      models: () => [import('./models/content/article')],
      component: () => import('./routes/content/article/'),
    }, {
      path: '/content/article/add',
      models: () => [import('./models/content/article/editor')],
      component: () => import('./routes/content/article/editor/'),
    }, {
      path: '/content/article/edit/:id',
      models: () => [import('./models/content/article/editor')],
      component: () => import('./routes/content/article/editor/'),
    }, {
      path: '/content/article/view/:id',
      models: () => [import('./models/content/article/detail')],
      component: () => import('./routes/content/article/detail/'),
    }, {
      path: '/account/user',
      models: () => [import('./models/account/user')],
      component: () => import('./routes/account/user/'),
    }, {
      path: '/account/user/:id',
      models: () => [import('./models/account/user/detail')],
      component: () => import('./routes/account/user/detail/'),
    }, {
      path: '/account/group',
      models: () => [import('./models/account/group')],
      component: () => import('./routes/account/group/'),
    }, {
      path: '/account/group/:id',
      models: () => [import('./models/account/group/detail')],
      component: () => import('./routes/account/group/detail/'),
    }, {
      path: '/user',
      models: () => [import('./models/user')],
      component: () => import('./routes/user/'),
    }, {
      path: '/user/:id',
      models: () => [import('./models/user/detail')],
      component: () => import('./routes/user/detail/'),
    }, {
      path: '/authority/acl',
      models: () => [import('./models/authority/acl')],
      component: () => import('./routes/authority/acl/'),
    }, {
      path: '/authority/module',
      models: () => [import('./models/authority/module')],
      component: () => import('./routes/authority/module/'),
    }, {
      path: '/system/config',
      models: () => [import('./models/system/config')],
      component: () => import('./routes/system/config/'),
    }, {
      path: '/login',
      models: () => [import('./models/login')],
      component: () => import('./routes/login/'),
    }, {
      path: '/request',
      component: () => import('./routes/request/'),
    }, {
      path: '/UIElement/iconfont',
      component: () => import('./routes/UIElement/iconfont/'),
    }, {
      path: '/UIElement/search',
      component: () => import('./routes/UIElement/search/'),
    }, {
      path: '/UIElement/dropOption',
      component: () => import('./routes/UIElement/dropOption/'),
    }, {
      path: '/UIElement/layer',
      component: () => import('./routes/UIElement/layer/'),
    }, {
      path: '/UIElement/dataTable',
      component: () => import('./routes/UIElement/dataTable/'),
    }, {
      path: '/UIElement/editor',
      component: () => import('./routes/UIElement/editor/'),
    }, {
      path: '/chart/lineChart',
      component: () => import('./routes/chart/lineChart/'),
    }, {
      path: '/chart/barChart',
      component: () => import('./routes/chart/barChart/'),
    }, {
      path: '/chart/areaChart',
      component: () => import('./routes/chart/areaChart/'),
    }, {
      path: '/post',
      models: () => [import('./models/post')],
      component: () => import('./routes/post/'),
    },
  ]

  return (
    <ConnectedRouter history={history}>
      <App>
        <Switch>
          <Route exact path="/" render={() => (<Redirect to="/dashboard" />)} />
          {
            routes.map(({ path, ...dynamics }, key) => (
              <Route key={key}
                exact
                path={path}
                component={dynamic({
                  app,
                  ...dynamics,
                })}
              />
            ))
          }
          <Route component={error} />
        </Switch>
      </App>
    </ConnectedRouter>
  )
}

Routers.propTypes = {
  history: PropTypes.object,
  app: PropTypes.object,
}

export default Routers

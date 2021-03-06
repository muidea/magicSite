import React from 'react'
import PropTypes from 'prop-types'
import { Switch, Route, Redirect, routerRedux } from 'dva/router'
import dynamic from 'dva/dynamic'
import App from 'routes/app'

const { ConnectedRouter } = routerRedux

const Routers = ({ history, app }) => {
  const error = dynamic({
    app,
    component: () => import('./routes/error'),
  })
  const routes = [
    {
      path: '/view',
      models: () => [import('./models/view')],
      component: () => import('./routes/view/'),
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
      path: '/content/catalog',
      models: () => [import('./models/content/catalog')],
      component: () => import('./routes/content/catalog/'),
    }, {
      path: '/content/link',
      models: () => [import('./models/content/link')],
      component: () => import('./routes/content/link/'),
    }, {
      path: '/content/link/view/:id',
      models: () => [import('./models/content/link/detail')],
      component: () => import('./routes/content/link/detail/'),
    }, {
      path: '/content/media',
      models: () => [import('./models/content/media')],
      component: () => import('./routes/content/media/'),
    }, {
      path: '/content/media/view/:id',
      models: () => [import('./models/content/media/detail')],
      component: () => import('./routes/content/media/detail/'),
    }, {
      path: '/authority/account',
      models: () => [import('./models/authority/account')],
      component: () => import('./routes/authority/account/'),
    }, {
      path: '/authority/endpoint',
      models: () => [import('./models/authority/endpoint')],
      component: () => import('./routes/authority/endpoint/'),
    }, {
      path: '/authority/private',
      models: () => [import('./models/authority/private')],
      component: () => import('./routes/authority/private/'),
    }, {
      path: '/statistics/dashboard',
      models: () => [import('./models/statistics/dashboard')],
      component: () => import('./routes/statistics/dashboard/'),
    }, {
      path: '/statistics/monitor',
      models: () => [import('./models/statistics/monitor')],
      component: () => import('./routes/statistics/monitor/'),
    }, {
      path: '/system/info',
      models: () => [import('./models/system/config')],
      component: () => import('./routes/system/config/'),
    }, {
      path: '/login',
      component: () => import('./routes/login/'),
    },
  ]

  return (
    <ConnectedRouter history={history}>
      <App>
        <Switch>
          <Route exact path="/" render={() => (<Redirect to="/view" />)} />
          {
            routes.map(({ path, ...dynamics }, key) => (
              <Route
                key={key}
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

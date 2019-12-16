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
      path: '/content/catalog',
      models: () => [import('./models/content/catalog')],
      component: () => import('./routes/content/catalog/'),
    }, {
      path: '/content/catalog/view/:id',
      models: () => [import('./models/content/catalog/detail')],
      component: () => import('./routes/content/catalog/detail/'),
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
      path: '/account/user',
      models: () => [import('./models/account/user')],
      component: () => import('./routes/account/user/'),
    }, {
      path: '/account/user/view/:id',
      models: () => [import('./models/account/user/detail')],
      component: () => import('./routes/account/user/detail/'),
    }, {
      path: '/account/group',
      models: () => [import('./models/account/group')],
      component: () => import('./routes/account/group/'),
    }, {
      path: '/account/group/view/:id',
      models: () => [import('./models/account/group/detail')],
      component: () => import('./routes/account/group/detail/'),
    }, {
      path: '/authority/acl',
      models: () => [import('./models/authority/acl')],
      component: () => import('./routes/authority/acl/'),
    }, {
      path: '/authority/acl/view/:id',
      models: () => [import('./models/authority/acl/detail')],
      component: () => import('./routes/authority/acl/detail/'),
    }, {
      path: '/authority/module',
      models: () => [import('./models/authority/module')],
      component: () => import('./routes/authority/module/'),
    }, {
      path: '/authority/module/view/:id',
      models: () => [import('./models/authority/module/detail')],
      component: () => import('./routes/authority/module/detail/'),
    }, {
      path: '/authority/module/edit/:id',
      models: () => [import('./models/authority/module/edit')],
      component: () => import('./routes/authority/module/edit/'),
    }, {
      path: '/authority/user',
      models: () => [import('./models/authority/user')],
      component: () => import('./routes/authority/user/'),
    }, {
      path: '/authority/user/view/:id',
      models: () => [import('./models/authority/user/detail')],
      component: () => import('./routes/authority/user/detail/'),
    }, {
      path: '/authority/user/edit/:id',
      models: () => [import('./models/authority/user/edit')],
      component: () => import('./routes/authority/user/edit/'),
    }, {
      path: '/endpoint/registry',
      models: () => [import('./models/endpoint/registry')],
      component: () => import('./routes/endpoint/registry/'),
    }, {
      path: '/endpoint/registry/view/:id',
      models: () => [import('./models/endpoint/registry/detail')],
      component: () => import('./routes/endpoint/registry/detail/'),
    }, {
      path: '/module/registry',
      models: () => [import('./models/module/registry')],
      component: () => import('./routes/module/registry/'),
    }, {
      path: '/module/registry/view/:id',
      models: () => [import('./models/module/registry/detail')],
      component: () => import('./routes/module/registry/detail/'),
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
          <Route exact path="/" render={() => (<Redirect to="/dashboard" />)} />
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

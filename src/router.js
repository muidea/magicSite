import React from 'react'
import PropTypes from 'prop-types'
import { Router } from 'dva/router'
import App from './routes/app'

const registerModel = (app, model) => {
  if (!(app._models.filter(m => m.namespace === model.namespace).length === 1)) {
    app.model(model)
  }
}
 
const Routers = function ({ history, app }) {
  const routes = [
    {
      path: '/',
      component: App,
      getIndexRoute (nextState, cb) {
        require.ensure([], require => {
          registerModel(app, require('./models/dashboard'))
          cb(null, { component: require('./routes/dashboard/') })
        }, 'dashboard')
      },
      childRoutes: [
        {
          path: 'dashboard',
          getComponent (nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/dashboard'))
              cb(null, require('./routes/dashboard/'))
            }, 'dashboard')
          },
        }, {
          path: 'account/user',
          getComponent (nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/account/user'))
              cb(null, require('./routes/account/user/'))
            }, 'user')
          },
        }, {
          path: 'account/user/:id',
          getComponent (nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/account/user/detail'))
              cb(null, require('./routes/account/user/detail/'))
            }, 'user-detail')
          },
        }, {
          path: 'account/group',
          getComponent (nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/account/group'))
              cb(null, require('./routes/account/group/'))
            }, 'group')
          },
        }, {
          path: 'account/group/:id',
          getComponent (nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/account/group/detail'))
              cb(null, require('./routes/account/group/detail/'))
            }, 'group-detail')
          },
        }, {
          path: 'content/article',
          getComponent (nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/content/article'))
              cb(null, require('./routes/content/article/'))
            }, 'article')
          },
        }, {
          path: 'content/article/:id',
          getComponent (nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/content/article/detail'))
              cb(null, require('./routes/content/article/detail/'))
            }, 'article-detail')
          },
        }, {
          path: 'content/catalog',
          getComponent (nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/content/catalog'))
              cb(null, require('./routes/content/catalog/'))
            }, 'catalog')
          },
        }, {
          path: 'content/catalog/:id',
          getComponent (nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/content/catalog/detail'))
              cb(null, require('./routes/content/catalog/detail/'))
            }, 'catalog-detail')
          },
        }, {
          path: 'content/link',
          getComponent (nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/content/link'))
              cb(null, require('./routes/content/link/'))
            }, 'link')
          },
        }, {
          path: 'content/link/:id',
          getComponent (nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/content/link/detail'))
              cb(null, require('./routes/content/link/detail/'))
            }, 'link-detail')
          },
        }, {
          path: 'content/media',
          getComponent (nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/content/media'))
              cb(null, require('./routes/content/media/'))
            }, 'media')
          },
        }, {
          path: 'content/media/:id',
          getComponent (nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/content/media/detail'))
              cb(null, require('./routes/content/media/detail/'))
            }, 'media-detail')
          },
        }, {
          path: 'login',
          getComponent (nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/login'))
              cb(null, require('./routes/login/'))
            }, 'login')
          },
        }, {
          path: 'request',
          getComponent (nextState, cb) {
            require.ensure([], require => {
              cb(null, require('./routes/request/'))
            }, 'request')
          },
        }, {
          path: 'UIElement/iconfont',
          getComponent (nextState, cb) {
            require.ensure([], require => {
              cb(null, require('./routes/UIElement/iconfont/'))
            }, 'UIElement-iconfont')
          },
        }, {
          path: 'UIElement/search',
          getComponent (nextState, cb) {
            require.ensure([], require => {
              cb(null, require('./routes/UIElement/search/'))
            }, 'UIElement-search')
          },
        }, {
          path: 'UIElement/dropOption',
          getComponent (nextState, cb) {
            require.ensure([], require => {
              cb(null, require('./routes/UIElement/dropOption/'))
            }, 'UIElement-dropOption')
          },
        }, {
          path: 'UIElement/layer',
          getComponent (nextState, cb) {
            require.ensure([], require => {
              cb(null, require('./routes/UIElement/layer/'))
            }, 'UIElement-layer')
          },
        }, {
          path: 'UIElement/dataTable',
          getComponent (nextState, cb) {
            require.ensure([], require => {
              cb(null, require('./routes/UIElement/dataTable/'))
            }, 'UIElement-dataTable')
          },
        }, {
          path: 'UIElement/editor',
          getComponent (nextState, cb) {
            require.ensure([], require => {
              cb(null, require('./routes/UIElement/editor/'))
            }, 'UIElement-editor')
          },
        }, {
          path: 'chart/lineChart',
          getComponent (nextState, cb) {
            require.ensure([], require => {
              cb(null, require('./routes/chart/lineChart/'))
            }, 'chart-lineChart')
          },
        }, {
          path: 'chart/barChart',
          getComponent (nextState, cb) {
            require.ensure([], require => {
              cb(null, require('./routes/chart/barChart/'))
            }, 'chart-barChart')
          },
        }, {
          path: 'chart/areaChart',
          getComponent (nextState, cb) {
            require.ensure([], require => {
              cb(null, require('./routes/chart/areaChart/'))
            }, 'chart-areaChart')
          },
        }, {
          path: '*',
          getComponent (nextState, cb) {
            require.ensure([], require => {
              cb(null, require('./routes/error/'))
            }, 'error')
          },
        },
      ],
    },
  ]

  return <Router history={history} routes={routes} />
}

Routers.propTypes = {
  history: PropTypes.object,
  app: PropTypes.object,
}

export default Routers

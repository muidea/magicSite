import { message } from 'antd'
import dva from 'dva'
import createLoading from 'dva-loading'
import { createBrowserHistory as createHistory } from 'history'

// 1. Initialize
const app = dva({
  history: createHistory(),
  onError(error) {
    message.error(error.message)
  },
})

app.use(createLoading({ effects: true }))

// 2. Model
app.model(require('models/app'))

// 3. Router
app.router(require('./router'))

// 4. Start
app.start('#root')

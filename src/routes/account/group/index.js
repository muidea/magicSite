import React from 'react'
import PropTypes from 'prop-types'
import { routerRedux } from 'dva/router'
import { connect } from 'dva'

const Group = ({}) => {

  return (
    <div className="content-inner">
        Hello
    </div>
  )
}

export default connect()(Group)


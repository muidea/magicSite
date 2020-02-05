import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { Page } from 'components'

function View({ view, loading }) {
  return (
    <Page loading={loading.models.view} />
  )
}

View.propTypes = {
  view: PropTypes.object,
  loading: PropTypes.object,
}

export default connect(({ view, loading }) => ({ view, loading }))(View)

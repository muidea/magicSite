import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Badge } from 'antd'

const statusMap = ['processing', 'success', 'warning', 'error']

export default class Status extends Component {
  render() {
    const { value } = this.props
    const { id, name } = value
    return <Badge status={statusMap[id]} text={name} />
  }
}

Status.propTypes = { value: PropTypes.object }

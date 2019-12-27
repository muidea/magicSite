import React from 'react'
import PropTypes from 'prop-types'
import { Row, Col, List } from 'antd'
import { RowProps } from './common'

export default class PrivateSummary extends React.Component {
  constructor(props) {
    super(props)

    let value = {}
    if (props.value) {
      value = props.value
    }

    this.state = {
      value,
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.value) {
      this.setState({ value: nextProps.value })
    }
  }

  render() {
    const { value } = this.state

    return (
      <div>
        <Row {...RowProps} type="flex">
          <Col style={{ marginTop: 'auto', marginBottom: 'auto' }} span={3}>
            <span>权限组名称</span>
          </Col>
          <Col span={21}>
            {value.name}
          </Col>
        </Row>
        <Row {...RowProps} type="flex">
          <Col style={{ marginTop: 'auto', marginBottom: 'auto' }} span={3}>
            <span>权限组描述</span>
          </Col>
          <Col span={21}>
            {value.description}
          </Col>
        </Row>
        <Row {...RowProps} type="flex">
          <Col style={{ marginTop: 'auto', marginBottom: 'auto' }} span={3}>
            <span>权限列表</span>
          </Col>
          <Col span={21}>
            <List
              size="small"
              style={{ paddingRight: '30px' }}
              dataSource={value.privates}
              renderItem={item => (
                <List.Item>
                  <List.Item.Meta title={item.namePath} />
                </List.Item>
              )}
            />
          </Col>
        </Row>
      </div>
    )
  }
}

PrivateSummary.propTypes = {
  value: PropTypes.object,
}

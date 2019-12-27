import React from 'react'
import PropTypes from 'prop-types'
import { Row, Col, Input } from 'antd'
import { RowProps } from './common'

const TextArea = Input.TextArea

export default class PrivateGroup extends React.Component {
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

  onNameChange = (e) => {
    const { value } = this.state
    this.setState({ ...value, name: e.target.value })

    if (this.props.onChange) {
      this.props.onChange({ ...value, name: e.target.value })
    }
  }

  onDescChange = (e) => {
    const { value } = this.state
    this.setState({ ...value, description: e.target.value })

    if (this.props.onChange) {
      this.props.onChange({ ...value, description: e.target.value })
    }
  }

  render() {
    return (
      <div>
        <Row {...RowProps} type="flex" justify="left" >
          <Col span={12}>
            <Row>
              <Col style={{ marginTop: 'auto', marginBottom: 'auto' }} span={3}>
                <span>名称</span>
              </Col>
              <Col span={16}>
                <Input
                  style={{ width: '250px' }}
                  defaultValue={this.state.value.name}
                  onChange={this.onNameChange}
                  placeholder="请输入权限组名"
                />
              </Col>
            </Row>
          </Col>
          <Col span={12}>
            <Row>
              <Col style={{ marginTop: 'auto', marginBottom: 'auto' }} span={3}>
                <span>描述</span>
              </Col>
              <Col span={16}>
                <TextArea
                  type="text"
                  style={{ width: '250px' }}
                  defaultValue={this.state.value.description}
                  onChange={this.onDescChange}
                  placeholder="请输入权限组描述"
                />
              </Col>
            </Row>
          </Col>
        </Row>
      </div>
    )
  }
}

PrivateGroup.propTypes = {
  value: PropTypes.object,
}

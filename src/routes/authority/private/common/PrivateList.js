import React from 'react'
import PropTypes from 'prop-types'
import { Row, Col, List, Checkbox } from 'antd'
import { RowProps } from './common'

export default class PrivateList extends React.Component {
  constructor(props) {
    super(props)

    let value = []
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

  onChange = (e, index) => {
    let { value } = this.state
    if (e.target.checked) {
      value.push(index)
    } else {
      value = value.filter(_ => _ !== index)
    }

    this.props.onChange(value)
  }

  renderItem = (item, index) => {
    const { value } = this.state
    let checked = false
    if (value) {
      checked = value.includes(index)
    }

    return (
      <List.Item
        actions={[
          <Checkbox onChange={e => this.onChange(e, index)} checked={checked} />,
        ]}
      >
        <List.Item.Meta title={item.namePath} />
      </List.Item>
    )
  }

  render() {
    return (
      <Row {...RowProps}>
        <Col style={{ marginTop: 'auto', marginBottom: 'auto' }} span={3}>
          <span>权限列表</span>
        </Col>
        <Col span={21}>
          <List
            size="small"
            style={{ paddingRight: '30px' }}
            dataSource={this.props.onInitPrivateList()}
            renderItem={this.renderItem}
          />
        </Col>
      </Row>
    )
  }
}

PrivateList.propTypes = {
  onInitPrivateList: PropTypes.func,
  onChange: PropTypes.func,
}
